import React from 'react'
import classNamesBind from 'classnames/bind'
import styles from './App.module.scss'

import { AppProps } from './App.d'

const cx = classNamesBind.bind(styles)

const App: React.FC<AppProps.Props> = props => {
	const { className } = props

	return <div className={cx('wrapper', className)}>this is App!</div>
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
