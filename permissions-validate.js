import Globals from './Globals.js';

const { resources, actions } = Globals;

export default function (permissions, resource, action) {
    if (!actions.includes(action)) return false;
    if (!resources.includes(resource)) return false;
    return permissions.find(permission => 
        permission.resource === resource && permission[action] === true
    ) ? true : false;
}
