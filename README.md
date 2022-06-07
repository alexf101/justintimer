# justintimer

Helpful screen to share if you're a personal trainer conducting a remote workout session. Includes timer, music and a text box to put workout notes in.

# Developing

If you're on Mac, please make sure you have the following utilities installed:

    fswatch
    rsync

If you're not on Mac, you may need to improvise. The core toolchain should be fine, but you may need to put in an alternate command for watch.

This is built using esbuild and TypeScript + copying some static files around. Since esbuild doesn't check types, you should run

    yarn run watch

to parallelise running all these tools.

# Deploying

The following will compile all the relevant code into the `dist` directory.

    yarn run build-all
    yarn run deploy

To deploy, just copy that directory to any HTTP static file server.


## Feature requests:

- Configurable Tabata timer intervals
- Dual timers
- Free duration entry on timer
- Hush for Tabata
- Logo (blocked on getting a photo of JT's old logo)
- Music timers (for dance practice)
