"use client"

import Image from "next/image";
import { useState } from 'react';

function ShowError({errorMessage, active=true} : {errorMessage: string, active?: boolean}){
	return active ? (
		<>
			<label className="flex items-center pt-2 pb-2">
			<Image src = "/attention-icon.svg"
				alt = "!"
				height = "15"
				width = "15"
			/>
			<p className="pl-2 text-red-700 bold">{errorMessage}</p>
			</label>
		</>
	) : null
}

interface SeclectButtonProps {
	iconUrl?: string;
	label: string;
	buttonFunction?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	smallSize? : boolean;
}

function Button({iconUrl, label, buttonFunction, smallSize=false} : SeclectButtonProps){
	const size: string = smallSize ? "3rem" : "8rem";
	const image = iconUrl ? (
		<Image src = {iconUrl}
			alt = {label}
			height = "0"
			width = "0"
			className="h-5 w-auto"
		/>
		) : null;

	return (
		<>
			<button style={{width: size}} className="canBeActive justify-around flex text-white bg-gray-800 m-2 px-4 py-2.5 rounded-xl border-2 border-transparent w-100 hover:border-2 hover:border-green-900" onClick={buttonFunction}>
			{image}
			{label}
			</button>
		</>
	);
}

export default function App(){
	
	const totalValues : number[] = [160, 160, 160, 160, 130, 260];
	const multiplierValues : number[] = [2, 2, 3, 4, 10, 6];
	const [color, setColor] = useState<Array<boolean>>(resetColor());
	const [counter, setCounter] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
	const [multiplier, setMultiplier] = useState<number>(0);

	function resetColor(): boolean[]{
		return (Array(5).fill(false));
	}

	function changeButtonStatus(i: number){
		const colorList: HTMLCollectionOf<Element> = document.getElementsByClassName("canBeActive");
		colorList[i].classList.toggle("isActive");
	}

	function selectColor(elem: number){
		let newColor: boolean[] = color;
		newColor[elem] = !newColor[elem];
		setTotal(newColor[elem] ? totalValues[elem] : 0);
		setMultiplier(newColor[elem] ? multiplierValues[elem] : 0);
		changeButtonStatus(elem);
		for(let i = 0; i < 6; i++){
			if(i != elem && newColor[i]){
				newColor[i] = false;
				changeButtonStatus(i);
			}
		}
		setColor(newColor);
	}

	function changeCounter(){
		setCounter(!counter);
		changeButtonStatus(6);
		}

	function calculateScore(){
		const inputUs: HTMLInputElement | null = document.getElementById("Nous") as HTMLInputElement;
		const inputThey: HTMLInputElement | null = document.getElementById("Eux") as HTMLInputElement;
		const score: string | null = inputUs ? inputUs.value : null;

		if (score){
			if (score != "0" && inputUs && inputThey && Number(score) < total && Number(score) >= total / 2) {
				inputUs.value = counter ? String(Number(score) * multiplier * 2) : String(Number(score) * multiplier);
				inputThey.value = counter ? String((total - Number(score)) * multiplier * 2) : String((total - Number(score)) * multiplier);

				const beloteUs: HTMLInputElement | null = document.getElementById("beloteOfNous") as HTMLInputElement;
				const beloteThey: HTMLInputElement | null = document.getElementById("beloteOfEux") as HTMLInputElement;

				if (beloteUs && beloteThey){
					inputUs.value = String(Number(inputUs.value) + Number(beloteUs.placeholder) * 20 * multiplier);
					inputThey.value = String(Number(inputThey.value) + Number(beloteThey.placeholder) * 20 * multiplier);
				}
			}
		}
	}

	function ScoreInput({name} : {name: string}){
		const [beloteCount, setBeloteCount] = useState<number>(0);
		const [score, setScore] = useState<String>('0');
		const condition: boolean = Number(score) < 0;

		function Capot(){
			const inputMe: HTMLInputElement | null = document.getElementById(name) as HTMLInputElement;
			const otherName: string | null = (name == "Nous") ? "Eux" : "Nous"
			const inputOther: HTMLInputElement | null = document.getElementById(otherName) as HTMLInputElement;

			if (inputMe && inputOther) {
				inputMe.value = (counter ? String((total + 90) * multiplier * 2) : String((total + 90) * multiplier));
				inputOther.value = "0";
			}
		}

		return (
			<>
				<div className="flex-column m-2 justify-around">
				<p className="text-white text-center p-2">{name}</p>
				<input id={name} onChange={(e => setScore(e.target.value))} type="number" placeholder="Score" className="block bg-gray-800 w-full rounded-xl border-0 py-1.5 pl-4 pr-4 text-gray-400 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900 sm:text-sm sm:leading-6" />
				<div className="flex justify-around">
				{
					condition && <ShowError errorMessage="Veuillez entrer un nombre valide" />
				}
				</div>
				<div className="flex justify-around">
					<Button label="Capot" buttonFunction={Capot}/>
					<Button label="-" smallSize={true} buttonFunction={() => setBeloteCount((beloteCount > 0) ? beloteCount - 1 : beloteCount)}/>
					<input id={"beloteOf" + name} className="block w-[0.58rem] bg-gray-900" type="number" readOnly={true} placeholder={String(beloteCount)}/>
					<Button label="+" smallSize={true} buttonFunction={() => setBeloteCount((beloteCount < 4) ? beloteCount + 1 : beloteCount)}/>
				</div>
				</div>
			</>
		);
	}

	return (
		<>
		{/*Couleur*/}
		<div className="flex justify-around">
			<div className="inline-grid grid-cols-4">
				<Button iconUrl="/trefle.svg" label="Trèfle" buttonFunction={() => selectColor(0)} />
				<Button iconUrl="/carreau.svg" label="Carreau" buttonFunction={() => selectColor(1)} />
				<Button iconUrl="/coeur.svg" label="Coeur" buttonFunction={() => selectColor(2)} />
				<Button iconUrl="/pique.svg" label="Pique" buttonFunction={() => selectColor(3)} />
				<Button label="Sans Atout" buttonFunction={() => selectColor(4)} />
				<Button label="Tout Atout" buttonFunction={() => selectColor(5)} />
				<Button label="Contré" buttonFunction={changeCounter} />
			</div>
		</div>
		<div className="flex justify-around">
		{((color[0] || color[1]) && !counter) && <ShowError errorMessage="Cette couleur ne se joue que contré" />}
		</div>
		{/*Entrée des scores*/}
		<div className="flex justify-around">
			<div className="transparent"></div>
			<div className="transparent"></div>
			<ScoreInput name="Nous" />
			<ScoreInput name="Eux" />
			<div className="transparent"></div>
			<div className="transparent"></div>
		</div>
		<div className="flex justify-around">
			<Button label="Calculer" buttonFunction={calculateScore} /> 
		</div>
		</>
	);
}
