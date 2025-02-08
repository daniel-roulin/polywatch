import { Fragment } from 'react';

// TODO: Adjust style to match https://campus.epfl.ch/isacademia/schedule?view=week
export default function Timetable() {
	const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 - 19:00
	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

	return (
		<div className="h-full w-full p-8">
			<div
				className="
					border
					grid 
					h-full w-full
					gap-px
					grid-cols-[auto_1fr_1fr_1fr_1fr_1fr]
					grid-rows-[auto,repeat(12,0.25fr_0.75fr)]
				"
			>
				{/* Top row (Day headers) */}
				<div className="outline outline-1" />
				{days.map((day, index) => (
					<div key={`day-${index}`} className="outline outline-1 text-center font-semibold">
						{day}
					</div>
				))}

				{hours.map((hour, index) => (
					<Fragment key={`hour-${hour}`}>
						{/* Time Label Column */}
						<div
							className="outline outline-1 text-center p-2 flex items-center justify-center"
							style={{
								gridRowStart: `${index * 2 + 2}`,
								gridRowEnd: `${index * 2 + 4}`,
								gridColumnStart: 1,
								gridColumnEnd: 2,
							}}
						>
							{hour}:00
						</div>

						{/* Empty slots for each day */}
						{days.map((_, dayIndex) => (
							<div
								key={`slot-${hour}-${dayIndex}`}
								className="outline outline-1"
								style={{
									gridRowStart: `${index * 2 + 2}`,
									gridRowEnd: `${index * 2 + 4}`,
									gridColumnStart: dayIndex + 2,
									gridColumnEnd: dayIndex + 3,
								}}
							/>
						))}
					</Fragment>
				))}

				<div
					className="
						bg-[#33AEF5] rounded m-0.5 text-white
						flex flex-col items-center justify-center
					"
					style={{ gridRow: "3 / 6", gridColumn: "2 / 3" }}
				>
					<a href="#" className="font-bold">
						Analyse II
					</a>
					<a href="#" className="opacity-90">CE 14</a>
				</div>
			</div>
		</div>
	);
}