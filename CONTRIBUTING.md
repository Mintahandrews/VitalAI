# Contributing to VitalAI

First off, thank you for considering contributing to VitalAI! It's people like you that make VitalAI such a great health and wellness platform.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to [codemintah@gmail.com](mailto:codemintah@gmail.com).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for VitalAI. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

For detailed guidelines on creating issues, please refer to our [ISSUES.md](ISSUES.md) file.

**Before Submitting A Bug Report:**

- Check the debugging guide
- Check the FAQs on the wiki
- Search the [issues](https://github.com/mintahandrews/VitalAI/issues) to see if the problem has already been reported

**How Do I Submit A (Good) Bug Report?**

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots and animated GIFs if possible

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for VitalAI, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**

- Check if there's already a package which provides that enhancement
- Search the [issues](https://github.com/mintahandrews/VitalAI/issues) to see if the enhancement has already been suggested

**How Do I Submit A (Good) Enhancement Suggestion?**

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Include screenshots and animated GIFs if possible

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the TypeScript styleguide
- Include screenshots and animated GIFs in your pull request whenever possible
- Document new code
- End all files with a newline
- Ensure your changes maintain user privacy and data security
- Test health-tracking features thoroughly
- Include unit tests for new functionality

## Development Setup

1. Ensure you have:
   - Node.js (v16 or higher)
   - npm or yarn
   - A modern web browser

2. Setup steps:
   ```bash
   git clone https://github.com/mintahandrews/VitalAI.git
   cd VitalAI
   npm install
   cp .env.example .env
   ```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- Use TypeScript for all new code
- Prefer interfaces over types when possible
- Use explicit types (avoid `any`)
- Follow the existing code style
- Document complex functions and components

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown)
- Reference functions and classes in backticks: \`functionName()\`
- Document all public APIs
- Include examples for complex functionality

### Health & Wellness Feature Guidelines

When contributing health and wellness features:

- Ensure privacy by design
- Follow healthcare data best practices
- Document any health-related calculations or algorithms
- Consider accessibility for users with different abilities
- Test with various health metrics and scenarios
- Validate against established health guidelines when applicable

### Testing Guidelines

- Write tests for all new features
- Include both unit and integration tests
- Test across different browsers
- Verify mobile responsiveness
- Test with different health metric inputs
- Ensure proper error handling for invalid health data

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `bug` - Issues that are bugs
- `documentation` - Issues about documentation
- `enhancement` - Issues that are feature requests
- `health-tracking` - Health metric tracking features
- `ai-features` - AI assistant functionality
- `security` - Security-related changes
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Recognition

Contributors who help improve VitalAI will be recognized in our README.md and on our website (coming soon).

Thank you for contributing to VitalAI! 🎉
