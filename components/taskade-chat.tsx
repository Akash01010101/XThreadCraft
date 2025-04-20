import React, { useState } from 'react'

import { TurnstileWrapper } from './turnstile-wrapper';
function Taskadechat() {
    const [turnstileActive, setTurnstileActive] = useState(false);
  return (
    <div
      onClick={() => setTurnstileActive(true)}
      className="w-full max-w-4xl mx-auto mb-6 p-4 mt-10 cursor-pointer"
    >{turnstileActive ? (
      <div className="w-full max-w-4xl mx-auto mb-6 p-4">
        <TurnstileWrapper>
          <iframe
            id="taskade-chat"
            src="https://www.taskade.com/a/01JN5HMQW32K268B8909VY4DK0"
            width="100%"
            height="400"
            frameBorder="0"
            className="rounded-lg shadow-lg bg-white border border-gray-200 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            allow="clipboard-read; clipboard-write"
            allowFullScreen
          />
        </TurnstileWrapper>
      </div>) : ( <div className="rounded-lg shadow-lg bg-white border border-gray-200 p-6 text-center text-black">
          Click to verify and load chat
        </div> )}</div>
  )
}

export default Taskadechat