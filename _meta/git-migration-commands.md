# Git Subtree Migration Commands

## Phase 1: Prepare Lucerna Repository

```bash
cd /c/JOHNDOE_CLAUDE/lucerna

# Ensure we're on the latest main branch
git checkout main
git pull origin main

# Create temporary branch for subtree preparation
git checkout -b orga-migration-prep

# Verify oxymiron content exists
ls -la content/investigations/oxymiron-organizatsiya/

# Check commit history for the specific path
git log --oneline -- content/investigations/oxymiron-organizatsiya/ | head -20
```

## Phase 2: Extract Subtree with History

```bash
# Extract oxymiron investigation content with full git history
git subtree split --prefix=content/investigations/oxymiron-organizatsiya/ -b orga-content-only

# Verify the extracted branch contains only relevant files
git checkout orga-content-only
git log --oneline | head -10
git ls-tree -r HEAD
```

## Phase 3: Import to New Repository

```bash
cd /c/JOHNDOE_CLAUDE/orga

# Add lucerna as remote to pull the subtree
git remote add lucerna /c/JOHNDOE_CLAUDE/lucerna

# Pull the extracted content branch
git pull lucerna orga-content-only --allow-unrelated-histories

# Move content to proper Hugo structure
mkdir -p content/investigations/
mv *.md content/investigations/ 2>/dev/null || true
mv *.md content/ 2>/dev/null || true
mv images/ static/images/ 2>/dev/null || true

# Clean up remote
git remote remove lucerna
```

## Phase 4: Path Migration Strategy

### Current Paths (Lucerna)
- Base URL: `/investigations/oxymiron-organizatsiya/`
- Images: `/investigations/oxymiron-organizatsiya/images/`
- Files: `content/investigations/oxymiron-organizatsiya/index.ru.md`

### New Paths (ORGA)
- Base URL: `/`
- Images: `/images/`
- Files: `content/index.ru.md`

### Path Update Commands

```bash
cd /c/JOHNDOE_CLAUDE/orga

# Update internal links in content files
find content -name "*.md" -type f -exec sed -i 's|/investigations/oxymiron-organizatsiya/images/|/images/|g' {} +
find content -name "*.md" -type f -exec sed -i 's|{{< relref "/investigations/oxymiron-organizatsiya/|{{< relref "/|g' {} +
find content -name "*.md" -type f -exec sed -i 's|../oxymiron-organizatsiya/|../|g' {} +

# Update Hugo relref references
find content -name "*.md" -type f -exec sed -i 's|investigations/oxymiron-organizatsiya|/|g' {} +

# Fix image references
find content -name "*.md" -type f -exec sed -i 's|images/|/images/|g' {} +
```

## Commit History Verification

```bash
# Verify history preservation
git log --oneline --graph | head -20

# Check specific files exist with history
git log --follow -- content/index.ru.md | head -5
git log --follow -- content/index.en.md | head -5

# Verify no large files or unwanted content
git ls-tree -r --name-only HEAD | wc -l
du -sh .git/
```

## Post-Migration Cleanup

```bash
# Remove temporary branches from lucerna
cd /c/JOHNDOE_CLAUDE/lucerna
git checkout main
git branch -D orga-migration-prep orga-content-only

# Initial commit in orga repository
cd /c/JOHNDOE_CLAUDE/orga
git add .
git commit -m "feat: ORGA investigation migration from lucerna with preserved history

- Migrated oxymiron-organizatsiya investigation content
- Preserved complete git commit history (15+ commits)
- Updated asset paths for standalone repository
- Configured Hugo framework for dedicated ORGA site
- Added CI/CD pipeline for Netlify deployment"
```

## Critical Notes

1. **History Preservation**: All 15+ commits related to oxymiron investigation will be preserved
2. **Path Consistency**: sed commands ensure all internal references are updated
3. **Asset Organization**: Images moved to standard Hugo static/images/ structure
4. **Independence**: New repository is completely standalone, no lucerna dependencies