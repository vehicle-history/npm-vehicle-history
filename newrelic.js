var config = require('config');

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['vehicle-history'],
  /**
   * Your New Relic license key.
   */
  license_key: config.newrelic.license_key,
  ssl: true,
  agent_enabled: true,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: config.newrelic.logging
    /**
     * Where to put the log file -- by default just uses process.cwd +
     * 'newrelic_agent.log'. A special case is a filepath of 'stdout',
     * in which case all logging will go to stdout, or 'stderr', in which
     * case all logging will go to stderr.
     *
     * @env NEW_RELIC_LOG
     */
//    filepath: 'stdout'
  },
  browser_monitoring: {
    enable: false
  }
};
