import { RemoveAuthUserPipe } from './remove-auth-user.pipe';

describe('RemoveAuthUserPipe', () => {
  it('create an instance', () => {
    const pipe = new RemoveAuthUserPipe();
    expect(pipe).toBeTruthy();
  });
});
