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

// Assign popup to select equipment
$(".form-group").delegate(".listEquipement", 'click', function () {
  var topic = $(this).data('input')
  jeedom.cmd.getSelectModal({cmd: {type: 'info'}}, function (result) {
	$('[data-l1key=configuration][data-l2key=' + topic + ']').val(result.human)
  })
})


/* Fonction permettant l'affichage des commandes dans l'équipement */
function addCmdToTable(_cmd) {
  if (!isset(_cmd)) {
    var _cmd = {configuration: {}}
  }
//alert(_cmd.type)
  if (_cmd.type == 'info') { // This is an equipment for the equipment table
	var tableTarget = '#table_equ'
	
	
  } else { // This is the real command for the command table
	var tableTarget = '#table_cmd'
	
	var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">'
	tr += '<td class="hidden-xs">'
	tr += '<span class="cmdAttr" data-l1key="id"></span>'
	tr += '</td>'
	tr += '<td>'
	tr += '<input class="cmdAttr form-control input-sm" data-l1key="name" disabled placeholder="{{Nom de la commande}}">'
	tr += '</td>'
	tr += '<td>'
	tr += '<div class="input-group">'
	tr += '<input class="cmdAttr form-control input-sm roundedLeft" data-l1key="type" value="' + init(_cmd.type) + '" disabled/>'
	tr += '<span class="cmdAttr input-group-addon roundedRight" data-l1key="subType" value="' + init(_cmd.subType) + '" disabled/></span>'
	tr += '</div>'
	tr += '</td>'
	tr += '<td>'
	tr += '<label class="checkbox-inline"><input type="checkbox" class="cmdAttr" data-l1key="isVisible" checked disabled/>{{Afficher}}</label> '
	tr += '</td>'
	tr += '<td>'
	if (is_numeric(_cmd.id)) {
		tr += '<a class="btn btn-default btn-xs cmdAction" data-action="configure"><i class="fas fa-cogs"></i></a> '
		tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fas fa-rss"></i> Tester</a>'
	}
	tr += '</tr>'
  }

	$(tableTarget+' tbody').append(tr)
	var tr = $(tableTarget+' tbody tr').last()
	jeedom.eqLogic.buildSelectCmd({
		id:  $('.eqLogicAttr[data-l1key=id]').value(),
		filter: {type: 'info'},
		error: function (error) {
		$('#div_alert').showAlert({message: error.message, level: 'danger'})
		},
		success: function (result) {
		tr.find('.cmdAttr[data-l1key=value]').append(result)
		tr.setValues(_cmd, '.cmdAttr')
		jeedom.cmd.changeType(tr, init(_cmd.subType))
		}
	})
}

/* Permet la réorganisation des commandes dans l'équipement */
$("#table_equ").sortable({
  axis: "y",
  cursor: "move",
  items: ".cmd",
  placeholder: "ui-state-highlight",
  tolerance: "intersect",
  forcePlaceholderSize: true
})
