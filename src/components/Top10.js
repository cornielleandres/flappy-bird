import React from 'react';
import styled from 'styled-components';

// Images
import { goldMedal, silverMedal, bronzeMedal } from '../assets/index.js';

const StyledTable = styled.table`
	background-color: white;
	border: 1px solid black;
	border-collapse: collapse;
	min-width: 70%;
	height: 500px;
	position: absolute;
	color: black;

	* {
		border: 1px solid black;
		border-collapse: collapse;
		text-align: center;
		vertical-align: middle;
		font-size: 1.3rem;
		padding 5px 10px;
	}

	#gold-medal, #silver-medal, #bronze-medal {
		border: none;
		height: 30px;
		margin: 0;
		padding: 0;
	}

	tbody {
		tr {
			td {
				// .medal {
				// 	border: none;
				// 	height: 30px;
				// 	margin: 0;
				// 	padding: 0;
				// }
			}
		}
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
						<td>{
								i === 0
								?
								<img id = 'gold-medal' src = { goldMedal } alt = 'Gold Medal' />
								:
								i === 1
								?
								<img id = 'silver-medal' src = { silverMedal } alt = 'Silver Medal' />
								:
								i === 2
								?
								<img id = 'bronze-medal' src = { bronzeMedal } alt = 'Bronze Medal' />
								:
								null
							}
							{ entry.name }</td>
						<td>{ entry.score }</td>
					</tr>
				) }
			</tbody>
		</StyledTable>
	);
};

export default Top10;
