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

interface SeclectButtonProps{
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
	
	const totalPointsValues : number[] = [160, 160, 160, 160, 130, 260];
	const multiplierValues : number[] = [2, 2, 3, 4, 10, 6];
	const [color, setColor] = useState<Array<boolean>>(Array(5).fill(false));
	const [counter, setCounter] = useState<number>(1);
	const [overCounter, setOverCounter] = useState<number>(1);
	const [totalPoints, setTotal] = useState<number>(0);
	const [multiplier, setMultiplier] = useState<number>(0);
	const onlyCountered: boolean = ((color[0] || color[1]) && counter === 1);

	function changeButtonStatus(i: number): void{
		const colorList: HTMLCollectionOf<Element> = document.getElementsByClassName("canBeActive");
		colorList[i].classList.toggle("isActive");
	}

	function selectColor(elem: number): void{
		let newColor: boolean[] = color;
		newColor[elem] = !newColor[elem];
		setTotal(newColor[elem] ? totalPointsValues[elem] : 0);
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

	function changeCounter(): void{
		setCounter(3 - counter);
		changeButtonStatus(6);
	}

	function changeOverCounter(): void{
		if (counter === 2 || overCounter === 2){
			setOverCounter(3 - overCounter);
			changeButtonStatus(7);
		}
	}

	function addBelote(): void{
		const inputUs: HTMLInputElement | null = document.getElementById("Nous") as HTMLInputElement;
		const inputThey: HTMLInputElement | null = document.getElementById("Eux") as HTMLInputElement;
		const beloteUs: HTMLInputElement | null = document.getElementById("beloteOfNous") as HTMLInputElement;
		const beloteThey: HTMLInputElement | null = document.getElementById("beloteOfEux") as HTMLInputElement;

		if (inputUs && inputThey && beloteUs && beloteThey){
			const valueUs: number = Number(inputUs.value) + Number(beloteUs.placeholder) * 20 * multiplier; 
			const valueThey: number = Number(inputThey.value) + Number(beloteThey.placeholder) * 20 * multiplier;
			inputUs.value = String(valueUs);
			inputThey.value = String(valueThey);
		}
	}

	function calculateScore(): void{
		const inputUs: HTMLInputElement | null = document.getElementById("Nous") as HTMLInputElement;
		const inputThey: HTMLInputElement | null = document.getElementById("Eux") as HTMLInputElement;
		const score: string | null = inputUs ? inputUs.value : null;

		if (score && !onlyCountered){
			if (inputUs && inputThey && Number(score) < totalPoints) {
				inputUs.value = String(Number(score) * multiplier * counter * overCounter);
				inputThey.value = String((totalPoints - Number(score)) * multiplier * counter * overCounter);
				addBelote();
			}
		}
	}

	function ScoreInput({name} : {name: string}){
		const [beloteCount, setBeloteCount] = useState<number>(0);
		const [score, setScore] = useState<String>('0');
		const condition: boolean = Number(score) < 0;
		const otherName: string | null = (name === "Nous") ? "Eux" : "Nous";

		function capot(): void{
			const inputMe: HTMLInputElement | null = document.getElementById(name) as HTMLInputElement;
			const inputOther: HTMLInputElement | null = otherName ? document.getElementById(otherName) as HTMLInputElement : null;

			if (inputMe && inputOther && !onlyCountered) {
				inputMe.value = String((totalPoints + 90) * multiplier * counter * overCounter);
				inputOther.value = "0";
				addBelote();
			}
		}

		function dedans(): void{
			const inputMe: HTMLInputElement | null = document.getElementById(name) as HTMLInputElement;
			const inputOther: HTMLInputElement | null = otherName ? document.getElementById(otherName) as HTMLInputElement : null;

			if (inputMe && inputOther && !onlyCountered) {
				inputOther.value = String(totalPoints * multiplier * counter * overCounter);
				inputMe.value = "0";
				addBelote();
			}			
		}

		function actualizeOther(event: React.ChangeEvent<HTMLInputElement>): void{
			const inputMe: HTMLInputElement | null = document.getElementById(name) as HTMLInputElement;
			const inputOther: HTMLInputElement | null = otherName ? document.getElementById(otherName) as HTMLInputElement : null;

			if (inputMe && inputOther) {
				inputOther.value = String(totalPoints - Number(inputMe.value));
			}

			setScore(event.target.value)
		}

		return (
			<>
				<div className="flex-column m-2 justify-around">
				<p className="text-white text-center">{name}</p>
				<div className=" flex justify-around p-2">
				<input id={name} onChange={(e) => actualizeOther(e)} type="number" placeholder="Score" className="block bg-gray-800 w-auto rounded-xl border-0 py-1.5 pl-4 pr-4 text-gray-400 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-900" />
				</div>
				<div className="flex justify-around">
				{
					condition && <ShowError errorMessage="Veuillez entrer un nombre valide" />
				}
				</div>
				<div className="w-auto flex justify-around">
					<div className="flex-column">
						<div className="flex justify-around">
							<Button label="Capot" buttonFunction={capot}/>
							<Button label="Dedans" buttonFunction={dedans}/>
						</div>
						<div className="flex justify-around">
							<div className="flex items-center">
								<div>
									<p className="text-gray-400">Belote(s) :</p>
								</div>
							</div>
							<Button label="-" smallSize={true} buttonFunction={() => setBeloteCount((beloteCount > 0 && !color[4]) ? beloteCount - 1 : beloteCount)}/>
							<input id={"beloteOf" + name} className="block w-[0.58rem] bg-gray-900" type="number" readOnly={true} placeholder={String(beloteCount)}/>
							<Button label="+" smallSize={true} buttonFunction={() => setBeloteCount((beloteCount < 4 && !color[4]) ? beloteCount + 1 : beloteCount)}/>
						</div>
					</div>
				</div>
				</div>
			</>
		);
	}

	return (
		<>
		{/*Couleur*/}
		<div className="flex justify-around">
			<div className="inline-grid grid-cols-2 sm:grid-cols-4">
				<Button iconUrl="/trefle.svg" label="Trèfle" buttonFunction={() => selectColor(0)} />
				<Button iconUrl="/carreau.svg" label="Carreau" buttonFunction={() => selectColor(1)} />
				<Button iconUrl="/coeur.svg" label="Coeur" buttonFunction={() => selectColor(2)} />
				<Button iconUrl="/pique.svg" label="Pique" buttonFunction={() => selectColor(3)} />
				<Button label="Sans Atout" buttonFunction={() => selectColor(4)} />
				<Button label="Tout Atout" buttonFunction={() => selectColor(5)} />
				<Button label="Contré" buttonFunction={changeCounter} />
				<Button label="Surcontré" buttonFunction={changeOverCounter}/>
			</div>
		</div>
		<div className="flex justify-around">
		{
			onlyCountered && <ShowError errorMessage="Cette couleur ne se joue que contré" />
		}
		</div>
		{/*Entrée des scores*/}
		<div className="flex-column justify-around sm:flex">
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
