import React from "react";
import { Grid, Breadcrumb  } from "semantic-ui-react";
import DefectForm from "../components/DefectForm/DefectForm"; 
import DefectPQCS from "../components/DefectForm/DefectPQCS";

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
      <Grid  style={styles.grid}>
        <Grid.Column width={8}> 
            <DefectForm /> 
        </Grid.Column>
        <Grid.Column width={4}> 
            <DefectPQCS /> 
        </Grid.Column>
       
      </Grid>
    </>
  );
};
