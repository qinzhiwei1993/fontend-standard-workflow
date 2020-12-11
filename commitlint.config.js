module.exports = {
    extends: ['@commitlint/config-conventional'], // 基于@commitlint/config-conventional扩展
    // parserPreset: 'conventional-changelog-conventionalcommits', // commit信息的格式解析器
    rules: {
        'scope-empty': [0], // scope非必填
        'subject-case': [
            2,
            'always',
            [
                'lower-case', // default
                'upper-case', // UPPERCASE
                'camel-case', // camelCase
                'kebab-case', // kebab-case
                'pascal-case', // PascalCase
                'sentence-case', // Sentence case
                'snake-case', // snake_case
                'start-case', // Start Case
            ],
        ],
    },
}