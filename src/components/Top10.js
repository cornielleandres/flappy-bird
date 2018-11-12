import React from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
	background-color: white;
	border: 1px solid black;
	border-collapse: collapse;
	min-width: 70%;
	min-height: 100%;
	position: absolute;
	color: black;

	* {
		border: 1px solid black;
		border-collapse: collapse;
		text-align: center;
		font-size: 1.3rem;
		padding 5px 10px;
	}

	th {
		background-color: rgba(0, 0, 0, 0.2);
		font-weight: bold;
	}

	tr:nth-child(even) {
		background-color: rgba(0, 0, 0, 0.4);
	}

	table#t01 tr:nth-child(odd) {
		background-color: rgba(0, 0, 0, 0.6);
	}
`;

const Top10 = ({ top10, exitTop10 }) =>  {
	return(
		<StyledTable onClick = { exitTop10 }>
			<thead>
				<tr>
					<th>Name</th>
					<th>Score</th>
				</tr>
			</thead>

			<tbody>
				{ top10.map((entry, i) =>
					<tr key = { i }>
						<td>{ entry.name }</td>
						<td>{ entry.score }</td>
					</tr>
				) }
			</tbody>
		</StyledTable>
	);
};

export default Top10;
