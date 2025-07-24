import { User } from '@/domain/entities/User';
import { LocalAuthentication, OAuthAuthentication } from '@/domain/valueObjects/UserAuthentication';
import { AuthProvider } from '@/domain/enums/AuthProvider';
import { UserRole } from '@/domain/enums/UserRole';

describe('User.create()', () => {
  it('should create a valid USER object', () => {
    const user = User.create({
        role : UserRole.USER,
        email : 'akashca123@gmail.com',
        username : 'NormalUser',
        firstName : 'Akash',
        lastName : 'CA',
        authentication : new LocalAuthentication('password'),
        avatar : 'profilePicture',
        country : 'IND',
    });

    expect(user).toMatchObject({
      role: 'USER',
      username: 'NormalUser',
      email: 'akashca123@gmail.com',
      firstName: 'Akash',
      lastName: 'CA',
      avatar: 'profilePicture',
      country: 'IND',
      authProvider: 'LOCAL',
      password: 'password',
      oAuthId: null,
      isVerified: false,
      isArchived: false,
      preferredLanguage: 'js',
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalSubmission: 0,
      streak: 0,
    });

    expect(user.userId).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a valid ADMIN object', () => {
    const admin = User.create({
      role: UserRole.ADMIN,
      username: 'owner',
      email: 'admin@gmail.com',
      authentication: new OAuthAuthentication(AuthProvider.GOOGLE, 'googleid'),
      avatar: 'adminPhoto',
      country: 'IND',
      firstName: 'admin',
      lastName: 'owner123'
    });

    expect(admin).toMatchObject({
      role: 'ADMIN',
      username: 'owner',
      email: 'admin@gmail.com',
      firstName: 'admin',
      lastName: 'owner123',
      avatar: 'adminPhoto',
      country: 'IND',
      authProvider: 'GOOGLE',
      password: null,
      oAuthId: 'googleid',
      isVerified: false,
      isArchived: false,
      preferredLanguage: null,
      easySolved: null,
      mediumSolved: null,
      hardSolved: null,
      totalSubmission: null,
      streak: null,
    });

    expect(admin.userId).toBeDefined();
    expect(admin.createdAt).toBeInstanceOf(Date);
    expect(admin.updatedAt).toBeInstanceOf(Date);
  });
});
