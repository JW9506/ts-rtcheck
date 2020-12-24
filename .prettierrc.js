module.exports = {
  tabWidth: 2,
  semi: false,
  overrides: [
    {
      files: '*.ts',
      options: {
        semi: true,
        tabWidth: 4,
      },
    },
    {
      files: '*.md',
      options: {
        tabWidth: 4,
        semi: true,
        printWidth: 120,
      },
    },
  ],
  trailingComma: 'es5',
  arrowParens: 'always',
  singleQuote: true,
  htmlWhitespaceSensitivity: 'strict',
}
