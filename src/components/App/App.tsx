import React, { useRef, useState } from 'react'
import classNamesBind from 'classnames/bind'
import styles from './App.module.scss'
import { Map, ZoomControl, Circle, Placemark } from 'react-yandex-maps'

import { AppProps } from './App.d'

const cx = classNamesBind.bind(styles)

const App: React.FC<AppProps.Props> = props => {
	const { className } = props

	const [center, setCenter] = useState([55.75, 37.57])
	const [radius, setRadius] = useState(10)

	const onRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const _radius = Number(e.target.value)
		if (_radius && !Number.isNaN(_radius)) setRadius(_radius)
	}

	const onCenterChange = (e: any) => {
		const _center = e.get('target').geometry.getCoordinates() as number[]
		setCenter(_center)
	}

	function logslider(e) {
		const position = Number(e.target.value)
		// position will be between 0 and 100
		var minp = 0
		var maxp = 1000

		// The result should be between 100 an 10000000
		var minv = Math.log(1)
		var maxv = Math.log(20_000)

		// calculate adjustment factor
		var scale = (maxv - minv) / (maxp - minp)

		setRadius(Math.exp(minv + scale * (position - minp)))
	}

	return (
		<div className={cx('wrapper', className)}>
			<div style={{ width: '100%' }}>
				<input
					style={{ width: '100%' }}
					defaultValue={radius}
					onChange={logslider}
					type='range'
					min={0}
					max={1000}
				/>
			</div>
			<div className={cx('headerWrapper')}>
				<div className={cx('header')}>
					<div className={cx('logo')}>LOGO</div>

					<div className={cx('radiusWrapper')}>
						<div className={cx('fieldName')}>Радиус круга: </div>
						<div>
							<input className={cx('search')} defaultValue={radius} onChange={onRadiusChange} />
							км
						</div>
					</div>
				</div>
			</div>

			<Map
				className={cx('map')}
				defaultState={{
					center,
					zoom: 9,
				}}
			>
				<Circle
					geometry={[center, radius * 1000]}
					defaultOptions={{
						fillOpacity: 0.5,
					}}
				/>
				<Placemark
					geometry={center}
					defaultOptions={{
						draggable: true,
						preset: 'islands#circleDotIcon',
					}}
					onDrag={onCenterChange}
				/>
				<ZoomControl options={{ position: { right: 10, bottom: 30 } }} />
			</Map>
		</div>
	)
}

// const mapStateToProps = (state: IAppState): AppProps.Store => ({ });

// const mapDispatchToProps: MapDispatchToProps<
// 	AppProps.Dispatch,
// 	AppProps.Own
// > = (dispatch: TDispatch) => ({ });

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(App);

export default App
