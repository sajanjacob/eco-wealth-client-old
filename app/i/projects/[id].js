import ProjectDetails from "@/components/ProjectDetails";
import React from "react";
import styled from "styled-components";
function Project(props) {
	return (
		<Container>
			<ProjectDetails />
		</Container>
	);
}
export default Project;
const Container = styled.div``;
