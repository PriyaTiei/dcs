import React from "react";
import { Grid, Breadcrumb, Icon } from "semantic-ui-react";
import DefectForm from "../components/DefectForm/DefectForm";
import DefectFormInstructions from "../components/DefectForm/DefectFormInstructions";
import { DcsProvider } from "../context/DcsContext";

const styles = {
  breadcrumb: {
    color: "#777",
    paddingTop: "1rem",
    paddingBottom: "1rem",
  },
  grid: {
    marginTop: "1rem",
  },
};

export const DefectFormScreen = () => {
  return (
    <>
      <Breadcrumb style={styles.breadcrumb}>
        <Breadcrumb.Section href="/">Home</Breadcrumb.Section>
        <Breadcrumb.Divider icon="right angle" />
        <Breadcrumb.Section active>Defect Form</Breadcrumb.Section>
      </Breadcrumb>
      <Grid style={styles.grid}>
        <Grid.Column width={8}>
          <DcsProvider>
            <DefectForm />
          </DcsProvider>
        </Grid.Column>
        <Grid.Column width={4}>
          <DefectFormInstructions />
        </Grid.Column>
      </Grid>
    </>
  );
};
