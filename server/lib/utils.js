// COLLECTION SECURTY ARGUMENTS
PERMIT_LIST_ALL = [ 'insert', 'update', 'remove' ];

// SECUR METHODS FUNCTION NAMES
METHODS = ['start', 'stop', 'destroy'];

// USERS FIELDS PUBLISH
USERS_FIELDS = {
  fields: {
    'username': 1,
    'profile.fullname': 1,
    'profile.avatarUrl': 1,
    'roles': 1
  }
};

// if application member list search found then return.
Security.defineMethod("ifMemberAdmin", {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc, fields, modifier) {

    // IF UPDATED FIELD MEMBER THEN
    if (_.contains(fields, 'memberIds')) {

      // NOT ADMIN THEN DENY.
      if (!Roles.userIsInRole(userId, 'admin')) {
        return true;
      }

      // IF MODIFIER $push THEN
      if (_.has(modifier, '$push')) {
        const $userId = modifier.$push.memberIds;

        // IF MEMBERS THEN DENY
        if (_.contains(doc.memberIds, $userId)) {
          return true;
        }

        // IF REAL USER?
        if (_.isUndefined(Users.findOne($userId))) {
          return true;
        }
      }
    }

    // ELSE MEMBERIDS NOT ADMIN THEN DENY.
    if (!Roles.userIsInRole(userId, 'admin')) {
      return true;
    }
  }
});
