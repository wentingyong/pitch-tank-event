import { useState } from 'react';
import { Trade } from './pages/Trade';
import { BottomNav } from './components/BottomNav';

function App() {
	const [tab, setTab] = useState("trade");

	return (
		<div className="page-bg min-h-screen flex justify-center">
			{/* Phone-width column */}
			<main className="relative w-full max-w-[390px] px-4 pb-32">
				{tab === "trade" && <Trade />}
				{tab === "rankings" && <div className="text-white text-center pt-10">Rankings</div>}
				{tab === "chat" && <div className="text-white text-center pt-10">Chat</div>}
				{tab === "network" && <div className="text-white text-center pt-10">Network</div>}
				{tab === "portfolio" && <div className="text-white text-center pt-10">Portfolio</div>}
			</main>
			<BottomNav tab={tab} setTab={setTab} />
		</div>
	);
}

export default App;
