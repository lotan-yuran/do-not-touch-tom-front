// Style
import styles from "./complexDropList.module.scss";

// Context
import { useCodes } from "../../context/codesContext";

// Design component
import { DropList } from "../../stories/DropList/DropList";

// Constants
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignDropList } from "../../constants/newAppointment";

import { useEffect, useState } from "react";

export const ComplexDropList = ({ complexId, onChangeComplex }) => {
  const { organization } = useCodes();

  const [organizationId, setOrganizationId] = useState(null);

  useEffect(async () => {
    if (organization) {
      const defaultOrganization = organization[0];
      setOrganizationId(defaultOrganization?.id);
    }
  }, [organization]);

  useEffect(() => {
    complexId &&
      setOrganizationId(
        organization?.find(org => org?.Complexes?.find(complex => complex?.id == complexId))?.id
      );
  }, [organization]);

  const onChangeOrg = idVal => {
    setOrganizationId(idVal);
    onChangeComplex(organization?.find(org => org?.id == idVal)?.Complexes[0]?.id);
  };

  return (
    <div>
      <div className={styles["complex-drop-list-query"]}>
        <p>
          <span>איזה ארגון?</span>
        </p>
      </div>
      <DropList
        id={COMPONENT_IDS.CUSTOMER.DROPDOWNS.ORGANIZATION_MENU}
        fullWidth={true}
        value={organizationId}
        options={organization}
        onChange={onChangeOrg}
        {...propsDesignDropList}
      />
      {organizationId && (
        <>
          <div className={styles["complex-drop-list-query"]}>
            <p>
              <span>איזה מתחם?</span>
            </p>
          </div>
          <DropList
            id={COMPONENT_IDS.CUSTOMER.DROPDOWNS.COMPLEX_MENU}
            fullWidth={true}
            value={complexId}
            options={organization?.find(o => o.id == organizationId)?.Complexes || null}
            onChange={onChangeComplex}
            {...propsDesignDropList}
          />
        </>
      )}
    </div>
  );
};
