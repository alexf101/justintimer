# justintimer
Helpful screen to share if you're a personal trainer conducting a remote workout session. Includes timer, music and a text box to put workout notes in.

# Developing

This uses esbuild and TypeScript. Since esbuild doesn't check types, you should run

    yarn run build-static
    yarn run bc

to copy over static files, then watch for changes to build and check for type errors.
