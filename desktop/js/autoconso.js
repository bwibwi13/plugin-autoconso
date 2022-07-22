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
$("#eqlogictab").delegate(".listEquipement", 'click', function () {
  var topic = $(this).data('input')
  jeedom.cmd.getSelectModal({cmd: {type: 'info'}}, function (result) {
	$('[data-l1key=configuration][data-l2key=' + topic + ']').val(result.human)
  })
})
$("#equtab").delegate(".listEquipement", 'click', function () {
	var el = $(this)
//el.closest('tr').find('[data-l1key=configuration][data-l2key=' + el.data('input') + ']').css('outline', '3px solid red')
	jeedom.cmd.getSelectModal({cmd:{type:$(this).data('type'), subType:$(this).data('subType')}}, function (result) {
		var param = el.closest('.input-group').find('[data-l1key=configuration][data-l2key=' + el.data('input') + ']')
		param.val(result.human)
	})
})


/* Fonction permettant l'affichage des commandes dans l'équipement */
function addCmdToTable(_cmd) {
//alert(JSON.stringify(_cmd))
  if (!isset(_cmd)) {
    var _cmd = {configuration: {}}
  }
  
  if (_cmd.type == 'action') { // This is the real command for the command table
	var tableTarget = '#table_cmd'
	
	var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">'
	tr += '<td class="hidden-xs">'
	tr += '<span class="cmdAttr" data-l1key="id"></span>'
	tr += '</td>'
	tr += '<td>'
	tr += '<input class="cmdAttr form-control input-sm" data-l1key="name" disabled">'
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
		tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fas fa-rss"></i> {{Tester}}</a>'
	}
	tr += '</tr>'
  } else { // This is an equipment for the equipment table
	var tableTarget = '#table_equ'
	_cmd.type = 'info'
	_cmd.subType = 'string' // TODO: Subtype, even if not used, should be string but I can't find a way to force it by default :(
	
	var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">'
	tr += '<td class="hidden">'
	tr += '<span class="cmdAttr" data-l1key="id"></span>'
	tr += '</td>'
	tr += '<td class="hidden">'
	tr += '<input class="cmdAttr input-sm" data-l1key="type" value="' + init(_cmd.type) + '" disabled/>'
    tr += '<span class="subType" subType="' + init(_cmd.subType) + '"></span>'
	tr += '<label class="checkbox-inline"><input type="checkbox" class="cmdAttr" data-l1key="isVisible" unchecked disabled/>{{Afficher}}</label> '
	tr += '<label class="checkbox-inline"><input type="checkbox" class="cmdAttr" data-l1key="isHistorized" unchecked disabled/>{{Historiser}}</label> '
	tr += '</td>'
	tr += '<td>'
	tr += '<input class="cmdAttr form-control input-sm" data-l1key="order" style="text-align:center;" disabled>'
	tr += '</td>'
	tr += '<td>'
	tr += '<input class="cmdAttr form-control input-sm" data-l1key="name" placeholder="{{Nom}}">'
	tr += '</td>'
	tr += '<td>'
	tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="power" placeholder="{{Puissance estimee (W)}}">'
	tr += '</td>'
	tr += '<td>'
	tr += '<div class="input-group">'
	tr += '  <input type="text" class="cmdAttr form-control roundedLeft" data-l1key="configuration" data-l2key="status" placeholder="{{Commande statut}}">'
	tr += '  <span class="input-group-btn">'
	tr += '    <a class="btn btn-default roundedRight listEquipement" data-input="status" data-type="info" data-subType="binary"><i class="fas fa-list-alt"></i></a>'
	tr += '  </span>'
	tr += '</div>'
	tr += '</td>'
	tr += '<td>'
	tr += '<div class="input-group">'
	tr += '  <input type="text" class="cmdAttr form-control roundedLeft" data-l1key="configuration" data-l2key="onCmd" placeholder="{{Commande ON}}">'
	tr += '  <span class="input-group-btn">'
	tr += '    <a class="btn btn-default roundedRight listEquipement" data-input="onCmd" data-type="action"><i class="fas fa-list-alt"></i></a>'
	tr += '  </span>'
	tr += '</div>'
	tr += '</td>'
	tr += '<td>'
	tr += '<div class="input-group">'
	tr += '  <input type="text" class="cmdAttr form-control roundedLeft" data-l1key="configuration" data-l2key="offCmd" placeholder="{{Commande OFF}}">'
	tr += '  <span class="input-group-btn">'
	tr += '    <a class="btn btn-default roundedRight listEquipement" data-input="offCmd" data-type="action"><i class="fas fa-list-alt"></i></a>'
	tr += '  </span>'
	tr += '</div>'
	tr += '</td>'
	tr += '<td>'
	tr += '<i class="fas fa-minus-circle pull-right cmdAction cursor" data-action="remove" title="{{Supprimer l\'équipement}}"></i></td>'
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
  forcePlaceholderSize: true,
  update: function(event, ui) {
	  var order = 1
	  $('[data-l1key=order]').each(function(){
		  $(this).val(order++)
	  })
  }
})
