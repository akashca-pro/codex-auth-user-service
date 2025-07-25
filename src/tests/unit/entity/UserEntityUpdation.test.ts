import { User } from '@/domain/entities/User';
import { LocalAuthentication } from '@/domain/valueObjects/UserAuthentication';
import { UserRole } from '@/domain/enums/UserRole';
import { AuthProvider } from '@/domain/enums/AuthProvider';
import { EntityErrorType } from '@/domain/enums/entity/ErrorType';

describe('User Entity - update method', () => {
  const baseDTO = {
    userId: 'user-123',
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'avatar.png',
    country: 'India',
    authProvider: AuthProvider.LOCAL,
    password: 'initialPass',
    oAuthId: null,
    isVerified: false,
    isArchived: false,
    role: UserRole.USER,
    preferredLanguage: 'ts',
    easySolved: 10,
    mediumSolved: 5,
    hardSolved: 2,
    totalSubmission: 100,
    streak: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  it('should update personal fields', () => {
    const user = User.rehydrate(baseDTO);

    user.update({
      username: 'johnny',
      firstName: 'Johnny',
      lastName: 'Doee',
      country: 'USA',
      avatar: null,
    });

    expect(user.username).toBe('johnny');
    expect(user.firstName).toBe('Johnny');
    expect(user.lastName).toBe('Doee');
    expect(user.country).toBe('USA');
    expect(user.avatar).toBeNull();
  });

  it('should update metrics for regular users', () => {
    const user = User.rehydrate(baseDTO);

    user.update({
      preferredLanguage: 'py',
      easySolved: 20,
      mediumSolved: 15,
      hardSolved: 7,
      totalSubmission: 200,
      streak: 10,
    });

    expect(user.preferredLanguage).toBe('py');
    expect(user.easySolved).toBe(20);
    expect(user.mediumSolved).toBe(15);
    expect(user.hardSolved).toBe(7);
    expect(user.totalSubmission).toBe(200);
    expect(user.streak).toBe(10);
  });

  it('should NOT update metrics for admins', () => {
    const adminDTO = { ...baseDTO, role: UserRole.ADMIN };
    const admin = User.rehydrate(adminDTO);

    admin.update({
      preferredLanguage: 'go',
      easySolved: 100,
      mediumSolved: 100,
      hardSolved: 100,
      totalSubmission: 1000,
      streak: 100,
    });

    expect(admin.preferredLanguage).toBeNull();
    expect(admin.easySolved).toBeNull();
    expect(admin.mediumSolved).toBeNull();
    expect(admin.hardSolved).toBeNull();
    expect(admin.totalSubmission).toBeNull();
    expect(admin.streak).toBeNull();
  });

  it('should call markAsVerified()', () => {
    const user = User.rehydrate(baseDTO);
    const spy = jest.spyOn(user['authentication'], 'markAsVerified');

    user.update({ isVerified: true });

    expect(spy).toHaveBeenCalled();
  });

it('should update password for local auth', () => {
  const user = User.rehydrate(baseDTO);
  
  const localAuth = user['authentication'] as LocalAuthentication;
  const spy = jest.spyOn(localAuth, 'changePassword');

  user.update({ password: 'newSecret' });

  expect(spy).toHaveBeenCalledWith('newSecret');
});


  it('should throw if updating password on non-local auth', () => {
    const oauthDTO = {
      ...baseDTO,
      authProvider: AuthProvider.GOOGLE,
      password: null,
      oAuthId: 'oauth-id-xyz',
    };

    const user = User.rehydrate(oauthDTO);

    expect(() => user.update({ password: 'shouldFail' }))
      .toThrow(EntityErrorType.CannotSetPassword);
  });

  it('should update updatedAt timestamp', () => {
    const user = User.rehydrate(baseDTO);
    const oldUpdatedAt = user.updatedAt;

    user.update({ username: 'newname' });

    expect(user.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });
});
