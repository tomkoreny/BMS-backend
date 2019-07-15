const mapUserJson = input => {
  return {
        "email": input.email,
        "user_metadata": {},
        "email_verified": input.emailVerified,
        "app_metadata": {
          "textColor": input.textColor,
          "bgColor": input.bgColor,
        },
        "given_name": input.firstName,
        "family_name": input.lastName,
        "nickname": input.userName,
        "password": input.password,
        "username": input.userName
      }};
const mapUser = user => {
  return {
  email: user.email,
  name: user.name,
  firstName: user.given_name,
  lastName: user.family_name,
  picureUrl: user.picture,
  locale: user.locale,
  updatedAt: user.udated_at,
  createdAt: user.created_at,
  lastLogin: user.last_login,
  lastIp: user.last_ip,
  loginCount: user.logins_count,
  userdId: user.user_id,
  nickName: user.nickname,
  emailVerified: user.email_verified,
  userId: user.id,
  } 
};

export const UsersResolver =  async (root, args, context, info) => { 
  const { body } = await context.authApi.get('users');

  let returnArray = [];
  if (typeof body == 'object') {
    const bodyArray = <Array<any>> body;
      bodyArray.forEach(user => {
        returnArray.push(mapUser(user));
  });

  return returnArray;
}
}

export const UsersMutation = (root, args, context, info) => {
  //TODO: Validate inputs
  return  { 
    create: async (root, context, info) => {
      const {input} = root;
      let newUserJson =<any> mapUserJson(input);
      newUserJson.email_verified = !input.emailVerfied;
      newUserJson.name = newUserJson.given_name + ' ' + newUserJson.family_name;
      newUserJson.connection = "Username-Password-Authentication";
      const resp = await context.authApi.post('users', newUserJson);
      const user = resp.body;
      return mapUser(user); 
    },
    update: async (root, context, info) => {
      //TODO: Fix edgecase, its impossible to set if email is verified or not 
      //with update
      //TODO: Update does not update full name
      const {id, input} = root;
      let newUserJson = mapUserJson(input);
      const resp = await context.authApi.patch('users/' + id, newUserJson);
      const user = resp.body;
      return mapUser(user); 
    },
    // addRoles: async (root, context, info) => {
      // //TODO: Update does not update full name
      // const {id, roles} = root;
      // const resp = await context.authApi.patch('users/' + id + '/roles', {roles});
      // const user = resp.body;
      // return mapUser(user); 
    // },
  }}
