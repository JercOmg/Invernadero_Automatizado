const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

// Find all *List.jsx files recursively
function findListFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findListFiles(filePath, fileList);
    } else if (file.endsWith('List.jsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const listFiles = findListFiles(pagesDir);

for (const filePath of listFiles) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already translated
  if (content.includes('useTranslation')) {
    continue;
  }

  // Inject import
  content = content.replace(
    /import { Link, useNavigate } from 'react-router-dom';/,
    "import { Link, useNavigate } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';"
  );

  // Inject hook
  content = content.replace(
    /const navigate = useNavigate\(\);/,
    "const navigate = useNavigate();\n  const { t } = useTranslation();"
  );

  // Replace common strings
  content = content.replace(
    /'Error al cargar los datos'/g,
    "t('common.errorLoading')"
  );
  content = content.replace(
    /'¿Estás seguro de eliminar este registro\?'/g,
    "t('common.confirmDelete')"
  );
  content = content.replace(
    /'Error al eliminar el registro'/g,
    "t('common.errorDeleting')"
  );
  content = content.replace(
    /Crear Nuevo/g,
    "{t('common.createNew')}"
  );
  content = content.replace(
    /<th>Acciones<\/th>/g,
    "<th>{t('common.actions')}</th>"
  );
  content = content.replace(
    /No hay registros disponibles/g,
    "{t('common.noRecords')}"
  );
  content = content.replace(
    />\s*Editar\s*<\/button>/g,
    ">{t('common.edit')}</button>"
  );
  content = content.replace(
    />\s*Eliminar\s*<\/button>/g,
    ">{t('common.delete')}</button>"
  );

  // Dynamic titles
  const match = content.match(/<h1>(.*?)<\/h1>/);
  if (match) {
    const entityName = match[1];
    // Optional: we leave the title generic or use a specific key if we want.
    // For now we just replace it with a generic translation or skip the title translation
    // to avoid creating 10 keys dynamically. We'll use t(`menu.${entityName.toLowerCase()}s`) as fallback
    // Or we just don't replace the title automatically for all to avoid breaking specific keys.
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Translated:', path.basename(filePath));
}
