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
  ],
  trailingComma: 'es5',
  arrowParens: 'always',
  singleQuote: true,
  htmlWhitespaceSensitivity: 'strict',
}
