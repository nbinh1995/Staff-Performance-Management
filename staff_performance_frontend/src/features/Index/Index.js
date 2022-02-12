import React from "react";
// node.js library that concatenates classes (strings)
// javascipt plugin for creating charts
// react plugin used to create charts
// reactstrap components
import {
  Container,
} from "reactstrap";

import Header from "components/Headers/Header.js";

export default function Index() {
    return (<>
        <Header />
        {/* Page content */}
        <Container className="mt--7 bg-gradient-info" fluid  style={{minHeight:'calc(100vh - 358px)'}}>
      </Container>
    </>);
}
