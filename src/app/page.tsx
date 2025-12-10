"use client"

import { useUsername } from "@/hooks/use-username"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  )
}

export default Page

function Lobby() {
  const { username } = useUsername()
  const router = useRouter()
  const [joinRoomId, setJoinRoomId] = useState("")

  const searchParams = useSearchParams()
  const wasDestroyed = searchParams.get("destroyed") === "true"
  const error = searchParams.get("error")

  // Auto-clear error/destroyed messages after 10 seconds
  useEffect(() => {
    if (wasDestroyed || error) {
      const timer = setTimeout(() => {
        router.replace("/")
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [wasDestroyed, error, router])

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post()

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`)
      }
    },
  })

  const { mutate: joinRoom, isPending: isJoining } = useMutation({
    mutationFn: async () => {
      if (!joinRoomId.trim()) return
      router.push(`/room/${joinRoomId.trim()}`)
    },
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg space-y-6 sm:space-y-8">
        {wasDestroyed && (
          <div className="bg-red-950/50 border border-red-900 p-3 sm:p-4 text-center rounded-lg">
            <p className="text-red-500 text-sm sm:text-base font-bold">ROOM DESTROYED</p>
            <p className="text-zinc-500 text-xs sm:text-sm mt-2">
              All messages were permanently deleted.
            </p>
          </div>
        )}
        {error === "room-not-found" && (
          <div className="bg-red-950/50 border border-red-900 p-3 sm:p-4 text-center rounded-lg">
            <p className="text-red-500 text-sm sm:text-base font-bold">ROOM NOT FOUND</p>
            <p className="text-zinc-500 text-xs sm:text-sm mt-2">
              This room may have expired or never existed.
            </p>
          </div>
        )}
        {error === "room-full" && (
          <div className="bg-red-950/50 border border-red-900 p-3 sm:p-4 text-center rounded-lg">
            <p className="text-red-500 text-sm sm:text-base font-bold">ROOM FULL</p>
            <p className="text-zinc-500 text-xs sm:text-sm mt-2">
              This room is at maximum capacity.
            </p>
          </div>
        )}

        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-green-500">
            {">"}private_chat
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
            Ultra-secure, ephemeral messaging.
            <br className="hidden sm:block" />
            <span className="text-zinc-500">No traces. No history. No compromise.</span>
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="border border-zinc-800 bg-zinc-900/30 p-3 sm:p-4 rounded-lg">
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl">💣</div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300">Self-Destruct</h3>
              <p className="text-[10px] sm:text-xs text-zinc-600">Messages auto-delete after 10 minutes or on demand</p>
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/30 p-3 sm:p-4 rounded-lg">
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl">🔒</div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300">Screenshot Protected</h3>
              <p className="text-[10px] sm:text-xs text-zinc-600">Built-in protection against screenshots & screen recording</p>
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-900/30 p-3 sm:p-4 rounded-lg">
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-xl sm:text-2xl">⚡</div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300">Real-time</h3>
              <p className="text-[10px] sm:text-xs text-zinc-600">Instant message delivery with live synchronization</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="border border-zinc-800/50 bg-zinc-900/20 p-4 sm:p-5 rounded-lg">
          <h2 className="text-xs sm:text-sm font-bold text-zinc-400 mb-3 sm:mb-4 uppercase tracking-wide">How It Works</h2>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex gap-3">
              <span className="text-green-500 font-bold text-xs sm:text-sm shrink-0">1.</span>
              <p className="text-[10px] sm:text-xs text-zinc-500">Create a room or join with a room ID</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500 font-bold text-xs sm:text-sm shrink-0">2.</span>
              <p className="text-[10px] sm:text-xs text-zinc-500">Share the room link with your contact</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500 font-bold text-xs sm:text-sm shrink-0">3.</span>
              <p className="text-[10px] sm:text-xs text-zinc-500">Chat privately - all messages disappear after 10 min</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500 font-bold text-xs sm:text-sm shrink-0">4.</span>
              <p className="text-[10px] sm:text-xs text-zinc-500">Hit destroy to instantly delete everything</p>
            </div>
          </div>
        </div>

        <div className="border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6 backdrop-blur-md rounded-lg">
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500 text-xs sm:text-sm">Your Identity</label>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-2 sm:p-3 text-xs sm:text-sm text-zinc-400 font-mono rounded break-all">
                  {username}
                </div>
              </div>
            </div>

            <button
              onClick={() => createRoom()}
              className="w-full bg-zinc-100 text-black p-3 sm:p-3.5 text-xs sm:text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50 rounded active:scale-95"
            >
              CREATE SECURE ROOM
            </button>
          </div>
        </div>

        <div className="relative py-2 sm:py-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-zinc-500">Or</span>
          </div>
        </div>

        <div className="border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6 backdrop-blur-md rounded-lg">
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="flex items-center text-zinc-500 text-xs sm:text-sm">Join With Room ID</label>
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && joinRoomId.trim()) {
                    joinRoom()
                  }
                }}
                placeholder="Paste room ID here..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-700 p-2 sm:p-3 text-xs sm:text-sm font-mono rounded"
              />
            </div>

            <button
              onClick={() => joinRoom()}
              disabled={!joinRoomId.trim() || isJoining}
              className="w-full bg-zinc-100 text-black p-3 sm:p-3.5 text-xs sm:text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded active:scale-95"
            >
              JOIN ROOM
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}