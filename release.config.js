module.exports = {
    branches: ['main'], // Specify the branches for releases
    plugins: [
      '@semantic-release/commit-analyzer', // Analyze commit messages
      '@semantic-release/release-notes-generator', // Generate release notes
      '@semantic-release/changelog', // Update the changelog
      '@semantic-release/npm', // Publish to npm (optional)
      '@semantic-release/github', // Create GitHub releases
      [
        '@semantic-release/git',
        {
          assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'], // Commit updated files
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        },
      ],
    ],
  };