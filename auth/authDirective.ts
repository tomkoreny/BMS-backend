import { SchemaDirectiveVisitor } from 'apollo-server';
import {
  defaultFieldResolver,
} from 'graphql';

export class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        if (process.env.SKIP_AUTH !== 'TRUE')
          return resolve.apply(this, args);
        const requiredRole =
          field._requiredAuthRole ||
          objectType._requiredAuthRole;

        if (! requiredRole) {
          return resolve.apply(this, args);
        }

        const context = args[2];
        let userScopes = [];
        let scopeKey = 'permissions';

        if (!context.user) {
          throw new Error("not authorized");
        }

        if (typeof context.user[scopeKey] === 'string') {
          userScopes = context.user[scopeKey].split(' ');
        } else if (Array.isArray(context.user[scopeKey])) {
          userScopes = context.user[scopeKey];
        } else {
          throw new Error("not authorized");
        }

        let allowed = userScopes.includes(requiredRole.toLowerCase());

        if (!allowed) {
          throw new Error("not authorized");
        }

        return resolve.apply(this, args);
      };
    });
  }
}
