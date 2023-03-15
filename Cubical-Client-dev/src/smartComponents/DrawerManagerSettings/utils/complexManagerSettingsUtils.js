import complexService from "../../../services/complexService";
import {
  compareArraysOfObjectsAndReturnChanges,
  compareFlatObjects,
  compareFlatObjectAndReturnChanges
} from "../../../utilities/general";

export const onSaveComplexData = (oldData, newData) => {
  return Promise.all([updateDisables(oldData, newData), updateManagers(oldData, newData)]);
};

const updateDisables = async (oldData, newData) => {
  const deletedDisables = compareArraysOfObjectsAndReturnChanges(
    oldData.complexDisable,
    newData.complexDisable
  );
  const addedDisables = compareArraysOfObjectsAndReturnChanges(
    newData.complexDisable,
    oldData.complexDisable
  );
  const deletedDisablesIds = deletedDisables.map(item => item.id);
  const complexId = oldData.id;
  if (deletedDisablesIds.length > 0 || addedDisables.length > 0) {
    const updateDisables = await complexService.updateComplexDisables(
      complexId,
      deletedDisablesIds,
      addedDisables
    );
  }
  return updateDisables;
};
const updateManagers = async (oldData, newData) => {
  const deletedManagers = compareArraysOfObjectsAndReturnChanges(
    oldData.complexeAdmins,
    newData.complexeAdmins
  );
  const addedManagers = compareArraysOfObjectsAndReturnChanges(
    newData.complexeAdmins,
    oldData.complexeAdmins
  );

  const deletedManagersIds = deletedManagers.map(item => item.user_id);
  const complexId = oldData.id;
  if (deletedManagersIds.length > 0 || addedManagers.length > 0) {
    const updateDisables = await complexService.updateComplexManagers(
      complexId,
      deletedManagersIds,
      addedManagers
    );
  }
  return updateDisables;
};
