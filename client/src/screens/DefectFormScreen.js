import React from "react";
import { Grid,   Segment  } from "semantic-ui-react";
import DefectForm from "../components/DefectForm/DefectForm";  
import PQCSTable from "../components/DefectForm/PQCSTable";
import DefectImage from "../components/DefectForm/DefectImage";

const styles = {
  
  grid: {
    marginTop: "1rem",
  },
};

export const DefectFormScreen = () => {
  return (
    <>
      
      <Segment>
      <Grid  style={styles.grid}>
        
        <Grid.Column width={8}> 
            <DefectForm /> 
        </Grid.Column>
        <Grid.Column width={4}> 
            <DefectImage /> 
            <PQCSTable /> 
        </Grid.Column>          
      </Grid>
      </Segment>
    </>
  );
};
