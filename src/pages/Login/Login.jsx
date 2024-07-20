import TestImage from "../../assets/Spotify.svg"

function Login() {

  const myStyle = {
    borderRadius: "150px"
  }

    function HandleConnection() {
        const client_id = "0329ae26c3a24ae4a3ad466ec0b1aff7";
        const redirect_uri = "https://spotify-clone-pearl-nine.vercel.app";
        const api_uri = "https://accounts.spotify.com/authorize";
        const scope = ['user-read-email', 'user-read-private', 'user-read-playback-state',
          'user-modify-playback-state', 'user-read-currently-playing',
          'user-read-playback-position',
          'user-top-read',
          'user-read-recently-played', 'ugc-image-upload', 
          'app-remote-control', 'streaming', 'playlist-read-private',
          'playlist-read-collaborative', 'playlist-modify-private', 'playlist-modify-public',
          'user-follow-modify', 'user-follow-read', 'user-library-modify', 'user-library-read'];
        window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
          " "
        )}&response_type=token&show_dialog=true`;
      }

    return (
      <section className="h-[100vh] bg-green-900 w-full">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <img src={TestImage} alt="" />
          <button style={myStyle} className="mt-5 py-2 px-20 border-4 text-[20px] font-bold hover:bg-black hover:text-white duration-300 border-black bg-transparent" onClick={() => {
              HandleConnection();
            }}>Connect</button>
          </div>
      </section>
    );
}

export default Login;