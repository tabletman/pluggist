#!/usr/bin/env node

/**
 * 🎭 Serena Auto-MCPB Regeneration System
 * Watches the project and regenerates MCPB bundles automatically
 * when significant changes occur to MCP-related functionality
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const chokidar = require('chokidar');

class SerenaAutoMCPB {
  constructor() {
    this.projectRoot = process.cwd();
    this.watchPaths = [
      'mcp-server/**/*',
      'manifest.json',
      'src/lib/serena-orchestrator.ts',
      'supabase/functions/**/*',
      '.serena/hooks/**/*'
    ];
    this.debounceTime = 5000; // 5 second debounce
    this.regenerationQueue = new Set();
    this.isRegenerating = false;
    this.lastRegeneration = null;
    this.regenerationHistory = [];
  }

  /**
   * 🚀 Start the auto-regeneration system
   */
  async start() {
    console.log('🎭 Serena Auto-MCPB System Starting...');
    console.log('🎪 Watching paths:', this.watchPaths);

    // Initialize the watcher
    const watcher = chokidar.watch(this.watchPaths, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    // Set up event handlers
    watcher
      .on('change', (filePath) => this.onFileChange(filePath, 'change'))
      .on('add', (filePath) => this.onFileChange(filePath, 'add'))
      .on('unlink', (filePath) => this.onFileChange(filePath, 'delete'));

    console.log('✨ Serena is now watching for MCPB-worthy changes...');

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🎭 Serena Auto-MCPB shutting down gracefully...');
      watcher.close();
      process.exit(0);
    });
  }

  /**
   * 🎪 Handle file changes
   */
  async onFileChange(filePath, changeType) {
    console.log(`🎵 Serena detected ${changeType}: ${filePath}`);

    const impact = await this.assessImpact(filePath, changeType);
    
    if (impact.shouldRegenerate) {
      this.scheduleRegeneration({
        trigger: filePath,
        changeType,
        impact,
        timestamp: new Date()
      });
    }
  }

  /**
   * 🎯 Assess the impact of a file change
   */
  async assessImpact(filePath, changeType) {
    const impact = {
      shouldRegenerate: false,
      priority: 0,
      reason: '',
      estimatedUsers: 0
    };

    // Critical files that always trigger regeneration
    if (filePath === 'manifest.json') {
      impact.shouldRegenerate = true;
      impact.priority = 10;
      impact.reason = 'Manifest changed - core MCPB configuration updated';
      impact.estimatedUsers = 'all';
      return impact;
    }

    // MCP server changes
    if (filePath.startsWith('mcp-server/')) {
      impact.shouldRegenerate = true;
      impact.priority = 9;
      impact.reason = 'MCP server functionality changed';
      impact.estimatedUsers = 'ai-users';
      return impact;
    }

    // Orchestration system changes
    if (filePath.includes('serena-orchestrator')) {
      impact.shouldRegenerate = true;
      impact.priority = 8;
      impact.reason = 'Orchestration system updated - new AI capabilities';
      impact.estimatedUsers = 'power-users';
      return impact;
    }

    // Supabase functions (edge functions)
    if (filePath.startsWith('supabase/functions/')) {
      impact.shouldRegenerate = true;
      impact.priority = 7;
      impact.reason = 'Edge functions updated - enhanced performance';
      impact.estimatedUsers = 'all';
      return impact;
    }

    // Serena hooks
    if (filePath.startsWith('.serena/hooks/')) {
      impact.shouldRegenerate = true;
      impact.priority = 6;
      impact.reason = 'Development orchestration enhanced';
      impact.estimatedUsers = 'developers';
      return impact;
    }

    return impact;
  }

  /**
   * 🎼 Schedule a regeneration (with debouncing)
   */
  scheduleRegeneration(change) {
    this.regenerationQueue.add(change);
    
    // Clear existing timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Set new timeout
    this.debounceTimeout = setTimeout(async () => {
      await this.executeRegeneration();
    }, this.debounceTime);

    console.log(`⏰ Regeneration scheduled (${this.regenerationQueue.size} changes queued)`);
  }

  /**
   * 🎨 Execute the MCPB regeneration
   */
  async executeRegeneration() {
    if (this.isRegenerating) {
      console.log('🎭 Already regenerating, skipping...');
      return;
    }

    this.isRegenerating = true;
    const startTime = Date.now();
    
    try {
      console.log('\n🎪 === Serena MCPB Regeneration Starting ===');
      
      // Analyze queued changes
      const changes = Array.from(this.regenerationQueue);
      const highestPriority = Math.max(...changes.map(c => c.impact.priority));
      const reasons = changes.map(c => c.impact.reason);
      
      console.log(`🎯 Priority: ${highestPriority}/10`);
      console.log(`📝 Reasons:`, reasons);

      // Pre-regeneration checks
      await this.performPreRegenerationChecks();
      
      // Generate version identifier
      const version = await this.generateVersion(changes);
      const bundleName = `pluggist-unified-${version}.mcpb`;

      // Update manifest with new version if needed
      await this.updateManifestVersion(version);

      // Validate manifest
      console.log('🔍 Validating manifest...');
      execSync('npx mcpb validate manifest.json', { 
        cwd: this.projectRoot,
        stdio: 'pipe' 
      });

      // Create the bundle
      console.log('📦 Creating MCPB bundle...');
      const packResult = execSync(`npx mcpb pack . ${bundleName}`, { 
        cwd: this.projectRoot,
        stdio: 'pipe' 
      }).toString();

      // Extract bundle stats
      const stats = this.parseBundleStats(packResult);
      
      // Archive old bundle if it exists
      await this.archiveOldBundle();

      // Update symlink to latest
      await this.updateLatestSymlink(bundleName);

      const duration = Date.now() - startTime;
      
      // Log success
      const regenerationEvent = {
        timestamp: new Date().toISOString(),
        version,
        bundleName,
        changes: changes.length,
        duration,
        stats,
        triggers: changes.map(c => c.trigger),
        success: true
      };

      this.regenerationHistory.push(regenerationEvent);
      this.lastRegeneration = regenerationEvent;

      console.log('✨ === Regeneration Complete ===');
      console.log(`📦 Bundle: ${bundleName}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`📊 Size: ${stats.packageSize}`);
      console.log(`📁 Files: ${stats.totalFiles}`);
      console.log(`🗜️  Compression: ${stats.compressionRatio}`);

      // Notify about the update
      await this.sendRegenerationNotification(regenerationEvent);

    } catch (error) {
      console.error('🚨 Regeneration failed:', error.message);
      
      // Log failure
      this.regenerationHistory.push({
        timestamp: new Date().toISOString(),
        error: error.message,
        changes: this.regenerationQueue.size,
        success: false
      });
    } finally {
      // Clean up
      this.regenerationQueue.clear();
      this.isRegenerating = false;
    }
  }

  /**
   * 🔍 Pre-regeneration checks
   */
  async performPreRegenerationChecks() {
    // Check if MCP server dependencies are installed
    try {
      const mcpPackageJson = JSON.parse(
        await fs.readFile(path.join(this.projectRoot, 'mcp-server/package.json'), 'utf8')
      );
      
      // Simple check - in production would verify all dependencies
      console.log('✅ MCP server package.json valid');
    } catch (error) {
      throw new Error('MCP server package.json missing or invalid');
    }

    // Check if main project builds
    try {
      execSync('npm run build', { 
        cwd: this.projectRoot, 
        stdio: 'pipe',
        timeout: 30000 
      });
      console.log('✅ Project builds successfully');
    } catch (error) {
      throw new Error('Project build failed - cannot create bundle');
    }
  }

  /**
   * 🎨 Generate semantic version
   */
  async generateVersion(changes) {
    const date = new Date();
    const timestamp = date.toISOString()
      .replace(/[:-]/g, '')
      .split('.')[0]
      .replace('T', '-');
    
    const highestPriority = Math.max(...changes.map(c => c.impact.priority));
    
    // Create semantic version based on priority
    let versionType = 'patch';
    if (highestPriority >= 9) versionType = 'major';
    else if (highestPriority >= 7) versionType = 'minor';
    
    return `auto-${versionType}-${timestamp}`;
  }

  /**
   * 📊 Parse bundle creation output for stats
   */
  parseBundleStats(output) {
    const lines = output.split('\n');
    const stats = {
      packageSize: 'unknown',
      totalFiles: 'unknown',
      compressionRatio: 'unknown'
    };

    for (const line of lines) {
      if (line.includes('package size:')) {
        stats.packageSize = line.split('package size:')[1].trim();
      }
      if (line.includes('total files:')) {
        stats.totalFiles = line.split('total files:')[1].trim();
      }
    }

    return stats;
  }

  /**
   * 🔗 Update latest symlink
   */
  async updateLatestSymlink(bundleName) {
    const symlinkPath = path.join(this.projectRoot, 'pluggist-unified-latest.mcpb');
    
    try {
      await fs.unlink(symlinkPath);
    } catch {
      // Symlink doesn't exist, that's fine
    }

    try {
      await fs.symlink(bundleName, symlinkPath);
      console.log('🔗 Updated latest symlink');
    } catch (error) {
      // On Windows, symlinks might not work, so copy instead
      await fs.copyFile(
        path.join(this.projectRoot, bundleName),
        symlinkPath
      );
      console.log('📄 Updated latest copy (symlink not available)');
    }
  }

  /**
   * 📮 Send regeneration notification
   */
  async sendRegenerationNotification(event) {
    // In production, this could:
    // - Send webhooks to deployment systems
    // - Update a dashboard
    // - Notify team members
    // - Trigger automated testing
    
    console.log('📢 Notification: MCPB bundle regenerated automatically by Serena');
    
    // For now, just write to a log file
    const logPath = path.join(this.projectRoot, '.serena/regeneration-log.json');
    
    try {
      const existingLog = await fs.readFile(logPath, 'utf8').catch(() => '[]');
      const log = JSON.parse(existingLog);
      log.push(event);
      
      // Keep only last 50 entries
      if (log.length > 50) {
        log.splice(0, log.length - 50);
      }
      
      await fs.writeFile(logPath, JSON.stringify(log, null, 2));
    } catch (error) {
      console.warn('⚠️  Could not write regeneration log:', error.message);
    }
  }

  /**
   * 📈 Get regeneration statistics
   */
  getStats() {
    return {
      totalRegenerations: this.regenerationHistory.length,
      successfulRegenerations: this.regenerationHistory.filter(r => r.success).length,
      lastRegeneration: this.lastRegeneration,
      averageDuration: this.regenerationHistory
        .filter(r => r.duration)
        .reduce((sum, r) => sum + r.duration, 0) / 
        this.regenerationHistory.filter(r => r.duration).length || 0
    };
  }
}

// CLI interface
if (require.main === module) {
  const serenaAutoMCPB = new SerenaAutoMCPB();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      serenaAutoMCPB.start();
      break;
    case 'stats':
      console.log('📊 Serena Auto-MCPB Statistics:');
      console.log(JSON.stringify(serenaAutoMCPB.getStats(), null, 2));
      break;
    default:
      console.log('🎭 Serena Auto-MCPB System');
      console.log('Usage:');
      console.log('  node scripts/serena-auto-mcpb.js start  - Start watching');
      console.log('  node scripts/serena-auto-mcpb.js stats  - Show statistics');
      break;
  }
}

module.exports = SerenaAutoMCPB;