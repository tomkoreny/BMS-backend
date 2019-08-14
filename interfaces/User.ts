const mapUser = user => {
  const u = new User();
  u.email = user.email;
  u.name = user.name;
  u.firstName = user.given_name;
  u.lastName = user.family_name;
  u.pictureUrl = user.picture;
  u.locale = user.locale;
  u.updatedAt = user.updated_at;
  u.createdAt = user.created_at;
  u.lastLogin = user.last_login;
  u.lastIp = user.last_ip;
  u.loginCount = user.logins_count;
  u.nickName = user.nickname;
  u.emailVerified = user.email_verified;
  u.id = user.user_id;
  u.blocked = !!user.blocked;
  u.textColor = user.app_metadata.textColor;
  u.bgColor = user.app_metadata.bgColor;
  return u;
};

class User {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  locale: string;
  updatedAt: string;
  createdAt: string;
  lastLogin: string;
  lastIp: string;
  loginCount: string;
  id: string;
  nickName: string;
  emailVerified: boolean;
  blocked: boolean;
  password: string;
  textColor: string;
  bgColor: string;

  getAuth0Form() {
    return { 
        "email": this.email,
        "user_metadata": {},
        "email_verified": this.emailVerified,
        "app_metadata": {
          "textColor": this.textColor,
          "bgColor": this.bgColor,
        },
        "given_name": this.firstName,
        "family_name": this.lastName,
        "nickname": this.nickName,
        "password": this.password,
        "blocked": this.blocked,
        "username": this.nickName,
    }
  }
}

export class UserInterface {
  private auth0api;
  constructor(api) {
    this.auth0api = api;
  }

  async all() {
    const { body } = await this.auth0api.get('users');

    let returnArray: User[];
    returnArray = new Array<User>();
    if (typeof body == 'object') {
      const bodyArray = <Array<any>>body;
      bodyArray.forEach(user => {
        returnArray.push(mapUser(user));
      });

      return returnArray;
    }
  }

  async byId(id: string) {
    const { body } = await this.auth0api.get('user/' + id);
return mapUser(body);

  }
}
