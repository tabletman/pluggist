# Task Completion Checklist

## When Completing a Development Task

### 1. Code Quality Checks
```bash
# Run TypeScript type checking
pnpm tsc --noEmit

# Run ESLint
pnpm lint

# Build the project to ensure no build errors
pnpm build
```

### 2. Testing Locally
```bash
# Start development server and test changes
pnpm dev

# Test the production build locally
pnpm build && pnpm start
```

### 3. Pre-Commit Checklist
- [ ] All TypeScript errors resolved (or documented if temporary)
- [ ] ESLint warnings addressed
- [ ] Component props properly typed
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Accessibility checked (keyboard navigation, screen readers)
- [ ] Loading states implemented
- [ ] Error states handled gracefully
- [ ] Console free of errors and unnecessary logs

### 4. Git Workflow
```bash
# Check what files have changed
git status

# Review changes
git diff

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: [feature description]" 
# or "fix: [bug description]"
# or "chore: [maintenance task]"

# Push to repository
git push origin [branch-name]
```

### 5. Vercel Deployment Checks
- Ensure all environment variables are set in Vercel dashboard
- Check that build command is correct: `npm install -g pnpm && pnpm build`
- Verify install command: `npm install -g pnpm && pnpm install --no-frozen-lockfile`
- Monitor deployment logs for any errors
- Test the deployed version at pluggist.vercel.app

### 6. Database Changes
If database schema was modified:
```bash
# Create migration file
# Add SQL changes to migrations/ directory

# Apply locally
npx wrangler d1 execute pluggist-db --local --file=migrations/[new-migration].sql

# Document the migration in the PR/commit
```

### 7. Documentation Updates
- Update README.md if new features added
- Document any new environment variables
- Update API documentation if endpoints changed
- Add comments for complex logic

### 8. Performance Considerations
- Check bundle size impact
- Ensure images are optimized
- Verify lazy loading is implemented where appropriate
- Test Core Web Vitals scores

### 9. SEO Validation
- Ensure meta tags are properly set
- Validate structured data markup
- Check that sitemap is updated if new pages added
- Test Open Graph tags for social sharing

### 10. Final Review
- Test critical user flows end-to-end
- Verify mobile responsiveness
- Check cross-browser compatibility
- Ensure no sensitive data in code or logs