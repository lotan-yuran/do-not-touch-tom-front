import { useEffect, useState, useRef } from "react";

// Material-ui
import { IconButton } from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

// Style
import "./transition.scss";
import styles from "./stepperNewAppointment.module.scss";

// Transition
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Page
import {
  NewAppointmentSchedule,
  CreatedAppointment,
  NewAppointmentInfo,
  NewAppointmentGuidelines
} from "../../";

// Router
import history from "../../../router/history";
import { Switch, Router, Route, useLocation, Redirect, useRouteMatch } from "react-router-dom";

// SmartComponents
import PartialSchedule from "../PartialSchedule/PartialSchedule";
import { FixedBottomButton } from "../../../smartComponents/FixedBottomButton/FixedBottomButton";
import {
  GUIDELINES,
  pagesInOrder,
  PARTIAL_SCHEDULE,
  PREFIX,
  SAVED,
  SCHEDULE
} from "../../../constants/stepperPages";

const getPartialSchedulePageIndex = () => {
  return pagesInOrder.findIndex(page => page?.next?.to?.includes(PARTIAL_SCHEDULE)) + 1;
};

export default function StepperNewAppointment() {
  const [pageData, setPageData] = useState(null);
  const [transition, setTransition] = useState("");
  const [propsButtonNext, setPropsButtonNext] = useState({});

  const childInfoRef = useRef();
  const childScheduleRef = useRef();
  const childGuidelines = useRef();
  const childPartialAppointment = useRef();
  const childSavedRef = useRef();

  const pagesRefInOrder = [
    childInfoRef,
    childScheduleRef,
    childGuidelines,
    childPartialAppointment,
    childSavedRef
  ];

  const { path } = useRouteMatch();
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (transition === "right") {
      history[pagesInOrder[state?.index].back.func]({
        pathname: pagesInOrder[state?.index].back.to,
        state: {
          index: state.index === getPartialSchedulePageIndex() ? state?.index - 2 : state?.index - 1,
          // pressing back from partial component skips 2 component
          from: pathname
        }
      });
    } else if (transition === "left") {
      history[pagesInOrder[state?.index]?.next.func]({
        pathname: pagesInOrder[state?.index].next.to,
        state: { index: state?.index + 1, from: pathname }
      });
    }
  }, [transition]);

  const goBack = () => {
    if (transition === "right") {
      history[pagesInOrder[state?.index].back.func]({
        pathname: pagesInOrder[state?.index].back.to,
        state: { index: state?.index - 1, from: pathname }
      });
    } else {
      setTransition("right");
    }
  };

  const onClickBack = async () => {
    const onClickBackRef = pagesRefInOrder[state?.index]?.current?.onClickBack;
    if (typeof onClickBackRef === "function") {
      try {
        const data = await onClickBackRef();
        setPageData(data);
        goBack();
        return;
      } catch (e) {
        return;
      }
    }
    goBack();
  };

  const onClickNext = async () => {
    const onClickNextRef = pagesRefInOrder[state?.index]?.current?.onClickNext;
    if (typeof onClickNextRef === "function") {
      try {
        const data = await onClickNextRef();
        goNext();
        setPageData(data);
        return;
      } catch (e) {
        return;
      }
    }
    goNext();
  };

  const goNext = () => {
    if (transition === "left") {
      history[pagesInOrder[state?.index].next.func]({
        pathname: pagesInOrder[state?.index].next.to,
        state: { index: state?.index + 1, from: pathname }
      });
    } else {
      setTransition("left");
    }
  };

  return (
    <>
      {pagesInOrder[state?.index]?.isDisplayButtonBack && (
        <div className={styles["header"]}>
          <IconButton onClick={onClickBack} classes={{ root: styles["go-back-button"] }}>
            <ArrowForward />
          </IconButton>
        </div>
      )}
      <Router history={history}>
        <Route
          render={({ location }) => (
            <>
              <TransitionGroup>
                <CSSTransition timeout={500} key={location.key} classNames={transition}>
                  <Switch location={location}>
                    <Route
                      exact
                      path={`${path}/info`}
                      render={() => (
                        <NewAppointmentInfo
                          ref={childInfoRef}
                          setPropsButtonNext={setPropsButtonNext}
                          {...pageData}
                        />
                      )}
                    />
                    <Route
                      exact
                      path={`${path}/${SCHEDULE}`}
                      render={() => (
                        <>
                          {pageData ? (
                            <NewAppointmentSchedule
                              ref={childScheduleRef}
                              setPropsButtonNext={setPropsButtonNext}
                              {...pageData}
                            />
                          ) : (
                            <Redirect to={`/${PREFIX}`} />
                          )}
                        </>
                      )}
                    />
                    <Route
                      exact
                      path={`${path}/${GUIDELINES}`}
                      render={() => (
                        <>
                          {pageData ? (
                            <NewAppointmentGuidelines
                              ref={childGuidelines}
                              setPropsButtonNext={setPropsButtonNext}
                              {...pageData}
                            />
                          ) : (
                            <Redirect to={`/${PREFIX}`} />
                          )}
                        </>
                      )}
                    />
                    <Route
                      exact
                      path={`${path}/${PARTIAL_SCHEDULE}`}
                      render={() => (
                        <>
                          {pageData ? (
                            <PartialSchedule
                              passComponent={onClickNext}
                              goBack={goBack}
                              setPageData={setPageData}
                              infoList={pageData.addedAppointments}
                              failedAppointments={pageData.failedAppointments}
                              availableAppointments={pageData.availableAppointments}
                              setPropsButtonNext={setPropsButtonNext}
                              ref={childPartialAppointment}
                            />
                          ) : (
                            <Redirect to={`/${PREFIX}`} />
                          )}
                        </>
                      )}
                    />
                    <Route
                      exact
                      path={`${path}/${SAVED}`}
                      render={() => (
                        <>
                          {pageData ? (
                            <CreatedAppointment
                              goNext={goNext}
                              goBack={goBack}
                              infoList={pageData.addedAppointments}
                              ref={childSavedRef}
                            />
                          ) : (
                            <Redirect to={`/${PREFIX}`} />
                          )}
                        </>
                      )}
                    />
                    <Redirect
                      to={{
                        pathname: `/${PREFIX}/info`,
                        state: { index: 0 }
                      }}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </>
          )}
        />
      </Router>
      {pagesInOrder[state?.index || 0]?.isDisplayButtonNext && (
        <FixedBottomButton {...propsButtonNext} onClick={onClickNext} />
      )}
    </>
  );
}
