import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

test('bundling ios app', async () => {
  const appName = uniq('my-app');
  ensureNxProject('@nrwl/react-native', 'dist/packages/react-native');
  await runNxCommandAsync(`generate @nrwl/react-native:app ${appName}`);

  await expect(runNxCommandAsync(`test ${appName}`)).resolves.toMatchObject({
    stdout: expect.any(String),
  });

  const iosBundleResult = await runNxCommandAsync(`bundle-ios ${appName}`);
  expect(iosBundleResult.stdout).toContain('Done writing bundle output');
  expect(() =>
    checkFilesExist(`dist/apps/${appName}/ios/index.bundle`)
  ).not.toThrow();

  const androidBundleResult = await runNxCommandAsync(
    `bundle-android ${appName}`
  );
  expect(androidBundleResult.stdout).toContain('Done writing bundle output');
  expect(() =>
    checkFilesExist(`dist/apps/${appName}/android/index.bundle`)
  ).not.toThrow();
}, 240000);
