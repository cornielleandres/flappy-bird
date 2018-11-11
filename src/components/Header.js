import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
	padding: 15px;

	h1 {
		text-align: center;
		font-family: 'Indie Flower', cursive;
		font-size: 7vh;
		font-weight: bold;
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
