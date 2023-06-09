import withAuth from "@/utils/withAuth";
import React from "react";
import styled from "styled-components";
function dashboard(props) {
	return (
		<Container>
			<h1>Producer Dashboard</h1>
		</Container>
	);
}
export default withAuth(dashboard);
const Container = styled.div``;
