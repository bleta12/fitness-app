import React, { useState } from "react"


type WorkoutType = {
  id: string;
  title: string;
  duration?: string;
  focus?: string;
  intensity?: string;
  equipment?: string;
  plan: string;

}

type WorkoutProps = {

  title?: string;
  duration?: string;
  focus?: string;
  intensity?: string;
  equipment?: string;
  plan?: string;
  onDelete?:() => void;
}


const Card  = ({title,duration,intensity,equipment,plan,onDelete} : WorkoutProps ) => {



    return(


        <div className="shadow-md rounded-lg max-w-sm p-6 mt-5">
          <h2 className=" font-bold bg-gray-400 text-center mb-5">
            {title} titulli
          </h2>
          <div className="grid grid-cols-3 bg-gray-400 gap-4">
            <span className="">{duration} duration </span>
            <span className="">{intensity} instensity </span>
            <span className="">{equipment} equipment </span>
          </div>
          <div className="grid grid-rows-3 bg-gray-400 gap-2">
             <p className="">your workout plan:</p>
            <span>{plan}plani</span>


           <div className="flex justify-center">
          <button 
          className="bg-red-500 p-3"
          onClick={onDelete}>
            delete workout
          </button>
        </div>
          </div>
        </div>




    );
}

export default Card;