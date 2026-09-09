# Contributing Guide

## Code Style

- Use ES6+ syntax
- 2-space indentation
- Semicolons required
- Single quotes for strings
- Meaningful variable names

## Commit Convention

```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build process, dependencies

### Examples
```
feat(domain): add subdomain enumeration
fix(auth): fix JWT token validation
docs(api): update documentation
```

## Pull Request Process

1. Create a branch from `main`
2. Make your changes
3. Test your changes
4. Commit with meaningful messages
5. Push to your fork
6. Create a Pull Request
7. Wait for review and approval

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Code Review Checklist

- [ ] Code follows project style guide
- [ ] Comments added for complex logic
- [ ] No console.log in production code
- [ ] Error handling implemented
- [ ] Security best practices followed
- [ ] Tests added/updated
- [ ] Documentation updated

## Reporting Issues

### Bug Reports
Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment info (Node version, OS)
- Error logs/stack traces

### Feature Requests
Include:
- Use case/motivation
- Proposed solution
- Alternative solutions
- Examples/mockups if applicable
