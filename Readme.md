I made this app to learn about WebRTC.
It is right now a barebones implementation (until I complete it) as it was only a way for me to learn.

# Currently in this app, you can:

- Go to a specific room with a username and connect with your friend in a p2p Video call.
- Drag and resize your and your friend's live-video.
- Chat with your peer in a side-panel which you can hide with a button.

(I felt like explaining the whole theory (what I know atleast) down below cause.... why not?)

# Concept behind WebRTC as I currently understand:

### In summary, we're directly connecting two client machines by exchanging their Public IP addresses to save bandwidth, power and time that would have been there due to an intermediary server.

- Usually, a connection between two clients is made by involving a WebSocket server or HTTP long polling server in between.

- For small sized data like text, this is practical as the client(s) and server can keep listening to each other for events, and transfer that small sized data around based on predefined logic quickly and without using much bandwidth and power as it is just text.

#### BUTT 🍑, to dance around with large-sized-data (like a live video-call), it takes much much more time and bandwidth. Thats why your live-youtube-videos or sports when broadcasted, have latency in SECONDS!.

- Do you really want to see your friend just staring at you for 10 seconds after you say something and then wait for it to get to them only to realise before their response that you fumbled with your words and now you're saying that again while your friend is now responding to your previous bogus?

- No right?, so to eliminate this time and save server's bandwidth and power, we can make a direct-realtime-connection between two clients using WebRTC.

- But wait... how will the machine of my friend know that it has to connect with my machine and not any other machine in the world?

- Well... to tell both the specific clients about each other, we need (preferably) a WebSocket server in-between.

- But I said that we won't use an intermediate server... blah blah.... bandwidth... blah blah .....time ... latency blah blah. Am I stupid?

- Hold on and read carefully: We will only need the server to tell both the clients about each other's "Public IP address", and some Machine-Configurations. After they get each other's info, the server's job will be complete. Think like the server here is only being used to exchange their phone-numbers... not to establish a call.

- Now here's just one problem... a client doesn't know its own "Public IP address".

- What??? Yes, the client machine only knows about the "Private IP address" assigned to it by the router it is connected to (in case of mobile sims, the service provider). Actually, the router connected to other router/server connected to other router/server ......and so on connect and constitute a "Public IP address". What the device knows, is its "Private IP address".

- The routers (or service providers) assign a unique "Private IP address" to each device connected to them in order to uniquely identify every machine from every other machine. In short, when you search for "Why am I single?" but your mom searches for "How to make a chocolate cake?", the router ensures that you get the articles regarding your misery while your mom can see some recipes. You both won't know about the response the other gets.

- So how can my machine know its own "Public IP address"? Surely it can know by asking someone else... somebody who can see it's "Public IP address".... like a server.... right?

- Exactly! and those servers are called STUN/TURN servers. Think like they send/turn your info back to you (UNO-reverse). Your machine asks them for its own "Public IP address".

- Once you and your friend's machine know their own "Public IP address", they exchange it (and some machine-configurations) with each other (via the WebSocket server in-between) in order to negotiate for a call. This way both can know about the functionalities/features the other supports and on which "Public IP address" to establish a connection.

- After doing all that, they can technically exchange anything (real-time videos, photos, text, files etc...) without a server managing their communication.

- This feels snappier because it is a direct (peer-to-peer) connection without a server inbetween and also, it saves server's bandwidth and power because it isn't used at all after exchanging their info.

I've tried to explain this as if a layman could understand. Please read again slowly if it feels too much at a time.

## One thing to note: WebRTC uses UDP protocol (rather than TCP/IP)

- In terms of speed : UDP >>> TCP/IP (felt especially for large data)
- But to achieve that speed, it compromises on data quality by being lossy (whereas TCP/IP is very Robust).
- For things like a live-video-call, it isn't usually very necessary to get all the pixels for all the frames completely... we just need an acceptable and quick response and that's where WebRTC can be used.

# To run locally and play around:

- Make sure you have a JS runtime (Node / Bun / Deno etc.) and package manager (npm / pnpm / yarn / deno etc.). I've used Node with npm to create it so can't say about support from others but you may experiment. Also, you'll need a MongoDB URI (so install MongoDB locally or use one from your MongoAtlas account)

- In the root of SvelteKit directory, change the name of "sample.env" file to -> ".env".

- Open two terminals in the root of both: ExtServer and SvelteKit install dependencies by running: "npm install" (or shortly: "npm i") or use whatever pkg manager you have.

- Now in both the terminals: run "npm run dev".

- The SvelteKit directory-path terminal will give you a URL looking similar to : "http://localhost:5173", just open that in any browser (open it in 2 tabs of the same browser to test p2p (as your camera should not be used by other processes)).

- Just go to the same room from both tabs/browsers after signing up and enjoy!!!
