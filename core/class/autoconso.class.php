<?php
/* This file is part of Jeedom.
*
* Jeedom is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Jeedom is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
*/

/* * ***************************Includes********************************* */
require_once __DIR__  . '/../../../../core/php/core.inc.php';

class autoconso extends eqLogic {
  /*     * *************************Attributs****************************** */

  /*
  * Permet de définir les possibilités de personnalisation du widget (en cas d'utilisation de la fonction 'toHtml' par exemple)
  * Tableau multidimensionnel - exemple: array('custom' => true, 'custom::layout' => false)
  public static $_widgetPossibility = array();
  */

  /*
  * Permet de crypter/décrypter automatiquement des champs de configuration du plugin
  * Exemple : "param1" & "param2" seront cryptés mais pas "param3"
  public static $_encryptConfigKey = array('param1', 'param2');
  */

  /*     * ***********************Methode static*************************** */

  public static function cron() {
		foreach (eqLogic::byType('autoconso', true) as $eqLogic) {
			$autorefresh = $eqLogic->getConfiguration('autorefresh');
//log::add('autoconso', 'debug', 'cron for '.$eqLogic->getHumanName() . ' is "' . $autorefresh.'"');
			if ($autorefresh != '') {
				try {
					$c = new Cron\CronExpression(checkAndFixCron($autorefresh), new Cron\FieldFactory);
					if ($c->isDue()) {
						$eqLogic->optimizeAutoconso();
					}
				} catch (Exception $exc) {
					log::add('autoconso', 'error', __('Expression cron non valide pour', __FILE__) . ' ' . $eqLogic->getHumanName() . ' : ' . $autorefresh);
				}
			}
		}
  }

  /*     * *********************Méthodes d'instance************************* */

	// Called by the cron()
	public function optimizeAutoconso() {
		$body .= $this->getHumanName().' ';
	
		// Build table of equipment to control (TODO retrieve from configuration)
		$orderedList = array(
			//    0:Name    1:Consumption 2:Status 3:Turn ON 4:Turn OFF
			array('autoconso 1', 2800,      6856,    6857,     6858),
			array('autoconso 2',  700,      6861,    6862,     6863),
			array('autoconso 3',  300,      6866,    6867,     6868)
		);
	
		$currentPower = 350; //userFunction::elecInjection();
		$powerPV = 1000; //intval(cmd::byId(userFunction::ID_Onduleur_puissance)->execCmd());

		// Estimate consumption if everything is turned off
		$estimatedPower = $currentPower;
		foreach ($orderedList as $electricItem) {
			$turnedON = intval(cmd::byId($electricItem[2])->execCmd());
			if ($turnedON) {
				$estimatedPower += $electricItem[1];
			}
		}
		$body .= 'Injecting '.$currentPower.'W out of '.$estimatedPower.'W ('.$powerPV.'W of PV). ';

		//$heureCreuse = boolval(cmd::byId(userFunction::ID_Compt_elec_Nuit_nJour)->execCmd());
		//
		//// Minimum injection before we start turning ON equipment
		//if ($heureCreuse) {
			$securityMargin = $this->getConfiguration('security');
			if (! is_numeric($securityMargin)) {
				$securityMargin = 0;
			}
		//} else {
		//	$securityMargin = 400;
		//}
		$body .= 'Security margin of '.$securityMargin.'W. ';



	
		// Optimize auto-consumption
		foreach ($orderedList as $electricItem) {
			$turnedON = intval(cmd::byId($electricItem[2])->execCmd());
	
			if (($estimatedPower-$electricItem[1]>$securityMargin) && ($electricItem[1]<$powerPV)) {
				// It should be ON
				if (!$turnedON) {
					// Turn ON
					cmd::byId($electricItem[3])->execCmd();
					//$body .= cmd::byId($electricItem[2])->getName();
					$body .= $electricItem[0];
					$body .= ' turned ON ('.$estimatedPower.'-'.$electricItem[1].'). ';
					
					$currentPower -= $electricItem[1];
				} else {
					//$body .= cmd::byId($electricItem[2])->getName();
					$body .= $electricItem[0];
					$body .= ' already ON. ';
				}
				// Take the expected consumption in consideration for the remaining loops
				$estimatedPower -= $electricItem[1];
			} else {
				// It should be OFF
				if ($turnedON) {
					// Turn OFF
					cmd::byId($electricItem[4])->execCmd();
					//$body .= cmd::byId($electricItem[2])->getName();
					$body .= $electricItem[0];
					$body .= ' turned OFF ('.$currentPower.'+'.$electricItem[1].'). ';
	
					// Take the expected consumption in consideration for the remaining loops
					$currentPower += $electricItem[1]; //(actually done above, when estimating actual injection
					
				} else {
					//$body .= cmd::byId($electricItem[2])->getName();
					$body .= $electricItem[0];
					$body .= ' already OFF. ';
				}
			}
		}
		
		$body .= 'Should end up with an injection of '.$currentPower.'W.';
log::add('autoconso', 'debug', $body);
	}

  // Fonction exécutée automatiquement avant la création de l'équipement
  public function preInsert() {
  }

  // Fonction exécutée automatiquement après la création de l'équipement
  public function postInsert() {
  }

  // Fonction exécutée automatiquement avant la mise à jour de l'équipement
  public function preUpdate() {
  }

  // Fonction exécutée automatiquement après la mise à jour de l'équipement
  public function postUpdate() {
  }

  // Fonction exécutée automatiquement avant la sauvegarde (création ou mise à jour) de l'équipement
  public function preSave() {
  }

  // Fonction exécutée automatiquement après la sauvegarde (création ou mise à jour) de l'équipement
  public function postSave() {
  }

  // Fonction exécutée automatiquement avant la suppression de l'équipement
  public function preRemove() {
  }

  // Fonction exécutée automatiquement après la suppression de l'équipement
  public function postRemove() {
  }

  /*
  * Permet de crypter/décrypter automatiquement des champs de configuration des équipements
  * Exemple avec le champ "Mot de passe" (password)
  public function decrypt() {
    $this->setConfiguration('password', utils::decrypt($this->getConfiguration('password')));
  }
  public function encrypt() {
    $this->setConfiguration('password', utils::encrypt($this->getConfiguration('password')));
  }
  */

  /*
  * Permet de modifier l'affichage du widget (également utilisable par les commandes)
  public function toHtml($_version = 'dashboard') {}
  */

  /*
  * Permet de déclencher une action avant modification d'une variable de configuration du plugin
  * Exemple avec la variable "param3"
  public static function preConfig_param3( $value ) {
    // do some checks or modify on $value
    return $value;
  }
  */

  /*
  * Permet de déclencher une action après modification d'une variable de configuration du plugin
  * Exemple avec la variable "param3"
  public static function postConfig_param3($value) {
    // no return value
  }
  */

  /*     * **********************Getteur Setteur*************************** */

}

class autoconsoCmd extends cmd {
  /*     * *************************Attributs****************************** */

  /*
  public static $_widgetPossibility = array();
  */

  /*     * ***********************Methode static*************************** */


  /*     * *********************Methode d'instance************************* */

  /*
  * Permet d'empêcher la suppression des commandes même si elles ne sont pas dans la nouvelle configuration de l'équipement envoyé en JS
  public function dontRemoveCmd() {
    return true;
  }
  */

  // Exécution d'une commande
  public function execute($_options = array()) {
  }

  /*     * **********************Getteur Setteur*************************** */

}
