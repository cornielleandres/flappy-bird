import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
	padding: 10px;

	h1 {
		text-align: center;
		font-size: 5vh;
	}
`;

const Header = () => {
	return(
		<StyledHeader>
			<h1>Flappy Bird Clone</h1>
		</StyledHeader>
	);
};

export default Header;
