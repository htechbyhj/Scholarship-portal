import express from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

const TEMPLATE_ROOTS = [
  path.join(__dirname, 'landing', 'templates'),
  path.join(__dirname, 'admin_panel', 'templates'),
  path.join(__dirname, 'student', 'templates'),
  path.join(__dirname, 'donor', 'templates'),
];

function findTemplate(templatePath: string): string {
  for (const root of TEMPLATE_ROOTS) {
    const candidate = path.join(root, templatePath);
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, 'utf-8');
    }
  }
  throw new Error(`Template not found: ${templatePath}`);
}

function resolveIncludes(html: string): string {
  return html.replace(/\{%\s*include\s+["']([^"']+)["']\s*%\}/g, (_match, incPath) => {
    return resolveIncludes(findTemplate(incPath));
  });
}

function extractBlocks(html: string): Record<string, string> {
  const blocks: Record<string, string> = {};
  const blockRegex = /\{%\s*block\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}/g;
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(html)) !== null) {
    blocks[match[1]] = match[2];
  }
  return blocks;
}

function renderDjangoTemplate(templatePath: string, context: {active_page?: string} = {}): string {
  let raw = findTemplate(templatePath);
  const extendsMatch = raw.match(/\{%\s*extends\s+["']([^"']+)["']\s*%\}/);

  if (extendsMatch) {
    const basePath = extendsMatch[1];
    let baseHtml = resolveIncludes(findTemplate(basePath));
    const childBlocks = extractBlocks(resolveIncludes(raw));

    baseHtml = baseHtml.replace(
      /\{%\s*block\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endblock\s*%\}/g,
      (_match, blockName, defaultContent) => {
        return childBlocks[blockName] !== undefined ? childBlocks[blockName] : defaultContent;
      },
    );
    raw = baseHtml;
  } else {
    raw = resolveIncludes(raw);
  }

  raw = raw.replace(/\{%\s*load\s+static\s*%\}/g, '');
  raw = raw.replace(/\{%\s*static\s+["']([^"']+)["']\s*%\}/g, '/static/$1');
  raw = raw.replace(
    /\{%\s*if\s+active_page\s*==\s*["']([^"']+)["']\s*%\}active\{%\s*endif\s*%\}/g,
    (_match, pageKey) => (context.active_page === pageKey ? 'active' : ''),
  );

  return raw;
}

app.use('/static', express.static(path.join(__dirname, 'static')));

const ROUTES: Array<{path: string; template: string; activePage?: string}> = [
  // Public Landing
  {path: '/', template: 'landing/index.html'},

  // Admin Panel
  {path: '/admin/', template: 'admin_panel/dashboard.html', activePage: 'dashboard'},
  {path: '/admin/dashboard/', template: 'admin_panel/dashboard.html', activePage: 'dashboard'},
  {path: '/admin/login/', template: 'admin_panel/auth/login.html'},
  {path: '/admin/users/', template: 'admin_panel/users/user_list.html', activePage: 'users'},
  {path: '/admin/students/', template: 'admin_panel/users/student_list.html', activePage: 'students'},
  {path: '/admin/donors/', template: 'admin_panel/users/donor_list.html', activePage: 'donors'},
  {path: '/admin/scholarships/', template: 'admin_panel/scholarships/scholarship_list.html', activePage: 'scholarships'},
  {path: '/admin/applications/', template: 'admin_panel/applications/application_list.html', activePage: 'applications'},
  {path: '/admin/documents/', template: 'admin_panel/documents/document_verification.html', activePage: 'documents'},
  {path: '/admin/funding/', template: 'admin_panel/funding/funding_list.html', activePage: 'funding'},
  {path: '/admin/funding-matches/', template: 'admin_panel/funding/funding_matches.html', activePage: 'funding_matches'},
  {path: '/admin/ml/recommendations/', template: 'admin_panel/ml/recommendations.html', activePage: 'ml_recommendations'},
  {path: '/admin/ml/model-runs/', template: 'admin_panel/ml/model_runs.html', activePage: 'ml_model_runs'},
  {path: '/admin/notifications/', template: 'admin_panel/notifications/notifications.html', activePage: 'notifications'},
  {path: '/admin/settings/', template: 'admin_panel/settings/settings.html', activePage: 'settings'},

  // Student Portal
  {path: '/student/', template: 'student/dashboard.html', activePage: 'dashboard'},
  {path: '/student/dashboard/', template: 'student/dashboard.html', activePage: 'dashboard'},
  {path: '/student/login/', template: 'student/auth/login.html'},
  {path: '/student/scholarships/', template: 'student/scholarships/scholarship_list.html', activePage: 'scholarships'},
  {path: '/student/scholarships/detail/', template: 'student/scholarships/scholarship_detail.html', activePage: 'scholarships'},
  {path: '/student/scholarships/apply/', template: 'student/applications/application_form.html', activePage: 'scholarships'},
  {path: '/student/scholarships/recommended/', template: 'student/scholarships/recommended.html', activePage: 'recommended'},
  {path: '/student/applications/', template: 'student/applications/application_list.html', activePage: 'applications'},
  {path: '/student/applications/detail/', template: 'student/applications/application_detail.html', activePage: 'applications'},
  {path: '/student/documents/upload/', template: 'student/documents/upload_documents.html', activePage: 'upload_documents'},
  {path: '/student/documents/', template: 'student/documents/my_documents.html', activePage: 'my_documents'},
  {path: '/student/profile/', template: 'student/profile/profile.html', activePage: 'profile'},
  {path: '/student/notifications/', template: 'student/notifications/notifications.html', activePage: 'notifications'},
  {path: '/student/settings/', template: 'student/profile/settings.html', activePage: 'settings'},

  // Donor Portal
  {path: '/donor/', template: 'donor/dashboard.html', activePage: 'dashboard'},
  {path: '/donor/dashboard/', template: 'donor/dashboard.html', activePage: 'dashboard'},
  {path: '/donor/login/', template: 'donor/auth/login.html'},
  {path: '/donor/scholarships/', template: 'donor/scholarships/my_scholarships.html', activePage: 'my_scholarships'},
  {path: '/donor/scholarships/create/', template: 'donor/scholarships/create_scholarship.html', activePage: 'create_scholarship'},
  {path: '/donor/funding/', template: 'donor/funding/funding_management.html', activePage: 'funding_management'},
  {path: '/donor/funding/add/', template: 'donor/funding/add_funding.html', activePage: 'add_funding'},
  {path: '/donor/matches/', template: 'donor/matches/funding_matches.html', activePage: 'funding_matches'},
  {path: '/donor/matched-students/', template: 'donor/matches/matched_students.html', activePage: 'matched_students'},
  {path: '/donor/notifications/', template: 'donor/notifications/notifications.html', activePage: 'notifications'},
  {path: '/donor/profile/', template: 'donor/profile/profile.html', activePage: 'profile'},
  {path: '/donor/settings/', template: 'donor/profile/settings.html', activePage: 'settings'},
];

for (const route of ROUTES) {
  app.get(route.path, (_req, res) => {
    const html = renderDjangoTemplate(route.template, {active_page: route.activePage});
    res.type('html').send(html);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ScholarBridge Django Template Preview running at http://localhost:${PORT}`);
});
