import React from "react";
import "./Home.css";
import RockP1 from "../Images/RockP1.jpg";
import PaperP1 from "../Images/PaperP1.jpg";
import ScissorsP1 from "../Images/ScissorsP1.jpg";

export const Home: React.FC = () => {
  //const movieInfo = useSelector((state: RootState) => state.movie);
  //const [game, setFilter] = useState<string>("");
  //const dispatch: AppDispatch = useDispatch();
  //useEffect(() => {
  //}, []);
  //const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  //};

  return (
    <div className="wholePage">
        <h1>CHOOSE!</h1>
        <table className="table">
          <thead>
            <tr>
              <td><button  className="rock"><img className="image" src={RockP1} alt="picOfRock"/></button></td>
              <td><button className="paper"><img className="image" src={PaperP1} alt="picOfPaper"/></button></td>
              <td><button className="scissors"><img className="image" src={ScissorsP1} alt="picOfScissors"/></button></td>
            </tr>
          </thead>
        </table>
    </div>
  );
};