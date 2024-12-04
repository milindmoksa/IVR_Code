<?xml version="1.0" encoding="UTF-8"?>
<xmi:XMI xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:datatypes="http://studio.genesyslab.com/common/datatypes/" xmlns:datatypes_1="http://studio.genesyslab.com/ird/datatypes" xmlns:ird="http://studio.genesyslab.com/ird/" xmlns:notation="http://www.eclipse.org/gmf/runtime/1.0.2/notation" xsi:schemaLocation="http://studio.genesyslab.com/common/datatypes/ http://studio.genesyslab.com/common/#//datatypes http://studio.genesyslab.com/ird/datatypes http://studio.genesyslab.com/ird/#//datatypes">
  <ird:StrategyDiagram xmi:id="_33D0EIoaEeG_nt9_QYQUcg" name="default" designedUsing="Composer 8.1.510.12">
    <history>8.1.0</history>
    <history>8.1.300.01</history>
    <blocks xmi:type="ird:EntryBlock" xmi:id="_6e2LkNz6EeKyG9aF7VXEXg" name="Entry1" starting="true" category="Entry">
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfEIwdEem8d8WkRWaMOg" name="system.ANI" value="_genesys.ixn.interactions[system.InteractionID].voice.ani" description="ANI associated with the calling party." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfEYwdEem8d8WkRWaMOg" name="system.BaseURL" value="getBaseURL()" description="Base URL" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfEowdEem8d8WkRWaMOg" name="system.CallID" value="_genesys.ixn.interactions[system.InteractionID].voice.callid" description="callid created by the switch." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfE4wdEem8d8WkRWaMOg" name="system.CurrentQueue" value="_genesys.ixn.interactions[system.InteractionID].msgbased.queue" description="queue attribute for this interaction." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfFIwdEem8d8WkRWaMOg" name="system.DNIS" value="_genesys.ixn.interactions[system.InteractionID].voice.dnis" description="DNIS associated with Called phone number" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfFYwdEem8d8WkRWaMOg" name="system.ExternalID" value="undefined" description="This is the ID of the interaction that has been assigned by the originating media server." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfFowdEem8d8WkRWaMOg" name="system.InitialInteractionID" value="system.StartEvent.data.interactionid" description="The ID of the interaction that started this session." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfF4wdEem8d8WkRWaMOg" name="system.InteractionID" value="system.StartEvent.data.interactionid" description="The current interaction ID." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfGIwdEem8d8WkRWaMOg" name="system.InteractionMediaType" value="undefined" description="The originating media type of the interaction." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfGYwdEem8d8WkRWaMOg" name="system.InteractionSubType" value="undefined" description="The origin sub-type of the interaction." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfGowdEem8d8WkRWaMOg" name="system.InteractionType" value="undefined" description="The origin type of the interaction." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfG4wdEem8d8WkRWaMOg" name="system.InteractionUID" value="_genesys.ixn.interactions[system.InteractionID].g_uid" description="The globally unique ID for the interaction that is defined by the underlying media system." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfHIwdEem8d8WkRWaMOg" name="system.Language" value="'en-US'" description="Application Language" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfHYwdEem8d8WkRWaMOg" name="system.LastErrorDescription" value="'undefined'" description="Last error description" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfHowdEem8d8WkRWaMOg" name="system.LastErrorEvent" value="'undefined'" description="Last error" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfH4wdEem8d8WkRWaMOg" name="system.LastErrorEventName" value="'undefined'" description="Last error event name" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfIIwdEem8d8WkRWaMOg" name="system.LastSubmitRequestId" value="'undefined'" description="Requestid  value of the Last queue:submit execution" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfIYwdEem8d8WkRWaMOg" name="system.LastTargetComponentSelected" value="'undefined'" description="Target to which the Interaction was routed definitively." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfIowdEem8d8WkRWaMOg" name="system.LastTargetObjectSelected" value="'undefined'" description="High-level Target to which the Interaction was routed definitively" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfI4wdEem8d8WkRWaMOg" name="system.LastTargetSelected" value="'undefined'" description="DN and the Switch name of the Target to which the Interaction was routed definitively" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfJIwdEem8d8WkRWaMOg" name="system.LastVirtualQueueSelected" value="'undefined'" description="The Alias of the Virtual Queue specified in the target list to which the target where the interaction was routed belongs" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfJYwdEem8d8WkRWaMOg" name="system.OCS_Record" value="getWorkflowOCSRecord()" description="OCS Record" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfJowdEem8d8WkRWaMOg" name="system.OCS_RecordURI" value="getWorkflowRecordURI()" description="OCS Record URI" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfJ4wdEem8d8WkRWaMOg" name="system.OCS_URI" value="getWorkflowOCSURI()" description="OCS URI" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfKIwdEem8d8WkRWaMOg" name="system.OPM" value="getOPMParameters()" description="Operational Parameters Data Variable" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfKYwdEem8d8WkRWaMOg" name="system.OriginatingSession" value="undefined" description="The originating session context." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfKowdEem8d8WkRWaMOg" name="system.ParentInteractionID" value="_genesys.ixn.interactions[system.InteractionID].parentid" description="The current interaction parent ID." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfK4wdEem8d8WkRWaMOg" name="system.RelativePathURL" value="getRelativePathURL()" description="Relative path" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfLIwdEem8d8WkRWaMOg" name="system.StartEvent" value="undefined" description="The content of the specified start event" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfLYwdEem8d8WkRWaMOg" name="system.SubmittedBy" value="_genesys.ixn.interactions[system.InteractionID].location.media_server" description="This is the originating media type of the interaction." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfLowdEem8d8WkRWaMOg" name="system.TenantID" value="parseInt(_genesys.ixn.interactions[system.InteractionID].tenantid)" description="The current Tenant ID." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfL4wdEem8d8WkRWaMOg" name="system.TenantName" value="_genesys.session.tenant" description="The current Tenant name." type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfMIwdEem8d8WkRWaMOg" name="system.TerminateIxnOnExit" value="1" description="Flag to control if Exit block should terminate multimedia interactions. '1' - ON" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfMYwdEem8d8WkRWaMOg" name="system.ThisDN" value="system.StartEvent.data.focusdeviceid" description="ThisDN attribute of last point of presence for this call" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfMowdEem8d8WkRWaMOg" name="system.WebServiceStubbing" value="'0'" description="Flag to control WebServices Stubbing. '1' - ON" type="System"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfM4wdEem8d8WkRWaMOg" name="vBusinessSegment" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfNIwdEem8d8WkRWaMOg" name="vDNISCallType" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfNYwdEem8d8WkRWaMOg" name="vEnableRegionalLanguage" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfNowdEem8d8WkRWaMOg" name="vLanguage" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfN4wdEem8d8WkRWaMOg" name="vLocation" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfOIwdEem8d8WkRWaMOg" name="vOPMData" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfOYwdEem8d8WkRWaMOg" name="vRegionalLanguage" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfOowdEem8d8WkRWaMOg" name="vTemp" value="''" description="Enter Description" type="User"/>
      <variables xmi:type="datatypes:Variable" xmi:id="_jwDfO4wdEem8d8WkRWaMOg" name="vDNIS" value="''" description="Enter Description" type="User"/>
    </blocks>
    <blocks xmi:type="ird:ExitBlock" xmi:id="_6niNgNz6EeKyG9aF7VXEXg" name="Exit1" terminating="true" category="Exit"/>
    <blocks xmi:type="ird:EcmaScriptBlock" xmi:id="_IqutAIwcEem8d8WkRWaMOg" name="ECMAScript1" condition="try {&#xD;&#xA;&#x9;// your code&#xD;&#xA;&#x9;&#xD;&#xA;&#x9;AppState.vOPMData = system.OPM['7301']&#xD;&#xA;} catch (error) {&#xD;&#xA;&#x9;// error handling code&#xD;&#xA;}" category="ECMA Script" script="vOPMData = _genesys.session.getListItemValue('7301', 'OPM');&#xD;&#xA;var vIntegerTest = getValueFromListObject(vOPMData,'o_DNISCallType', ''); &#xD;&#xA;&#xD;&#xA;vLocation = vIntegerTest;"/>
    <blocks xmi:type="ird:AssignBlock" xmi:id="_JOTUIIwcEem8d8WkRWaMOg" name="Assign1" category="Assign">
      <assignData xmi:type="datatypes:KeyValuePairItem" xmi:id="_jxELsIwdEem8d8WkRWaMOg" Key="vDNIS" Value="'7301'"/>
    </blocks>
    <blocks xmi:type="ird:LogBlock" xmi:id="_53j20IwfEem8d8WkRWaMOg" name="Log1" category="Log">
      <loggingDetails>'vOPMData = '+ JSON.stringify(vOPMData);</loggingDetails>
      <loggingDetails>'vIntegerTest = ' + vLocation</loggingDetails>
    </blocks>
    <blocks xmi:type="ird:PlayApplicationBlock" xmi:id="_gfiMsIwhEem8d8WkRWaMOg" name="Play_Welcome" category="Play Application" resource="/Callflows/Main.callflow" type="ProjectFile"/>
    <blocks xmi:type="ird:PlaySoundBlock" xmi:id="_I4GIwI3LEem45N-Ef20MRA" name="PlaySound1" category="Play Sound" soundType="ARM">
      <resource xmi:type="datatypes_1:PlaySoundResourcePropertyItem" xmi:id="_SpNHYI3UEem45N-Ef20MRA" ResourceValueOrID="1003" ARMPersonalityID="11" ARMBaseURL="'http://jprgenuatapp1:8080'" ARMFileExt="'_gsm.wav'"/>
    </blocks>
    <links xmi:type="ird:WorkflowOutputLink" xmi:id="_7uvtMNz6EeKyG9aF7VXEXg" fromBlock="_6e2LkNz6EeKyG9aF7VXEXg" toBlock="_JOTUIIwcEem8d8WkRWaMOg"/>
    <links xmi:type="ird:WorkflowOutputLink" xmi:id="_LkjZ0IwcEem8d8WkRWaMOg" fromBlock="_JOTUIIwcEem8d8WkRWaMOg" toBlock="_gfiMsIwhEem8d8WkRWaMOg"/>
    <links xmi:type="ird:WorkflowOutputLink" xmi:id="_OnY4sIwcEem8d8WkRWaMOg" fromBlock="_IqutAIwcEem8d8WkRWaMOg" toBlock="_53j20IwfEem8d8WkRWaMOg"/>
    <links xmi:type="ird:WorkflowOutputLink" xmi:id="_7PzcIIwfEem8d8WkRWaMOg" fromBlock="_53j20IwfEem8d8WkRWaMOg" toBlock="_I4GIwI3LEem45N-Ef20MRA"/>
    <links xmi:type="ird:WorkflowOutputLink" xmi:id="_j7umwIwhEem8d8WkRWaMOg" fromBlock="_gfiMsIwhEem8d8WkRWaMOg" toBlock="_IqutAIwcEem8d8WkRWaMOg"/>
    <links xmi:type="ird:WorkflowOutputLink" xmi:id="_JdCMYI3MEem45N-Ef20MRA" fromBlock="_I4GIwI3LEem45N-Ef20MRA" toBlock="_6niNgNz6EeKyG9aF7VXEXg"/>
    <namespaces xmi:type="datatypes:Property" xmi:id="_5WEloNz6EeKyG9aF7VXEXg" name="ws" value="http://www.genesyslab.com/modules/ws"/>
    <namespaces xmi:type="datatypes:Property" xmi:id="_5WElodz6EeKyG9aF7VXEXg" name="queue" value="http://www.genesyslab.com/modules/queue"/>
    <namespaces xmi:type="datatypes:Property" xmi:id="_5WElotz6EeKyG9aF7VXEXg" name="dialog" value="http://www.genesyslab.com/modules/dialog"/>
    <namespaces xmi:type="datatypes:Property" xmi:id="_5WElo9z6EeKyG9aF7VXEXg" name="session" value="http://www.genesyslab.com/modules/session"/>
    <namespaces xmi:type="datatypes:Property" xmi:id="_5WElpNz6EeKyG9aF7VXEXg" name="ixn" value="http://www.genesyslab.com/modules/interaction"/>
    <namespaces xmi:type="datatypes:Property" xmi:id="_5WElpdz6EeKyG9aF7VXEXg" name="classification" value="http://www.genesyslab.com/modules/classification"/>
  </ird:StrategyDiagram>
  <notation:Diagram xmi:id="_33D0EYoaEeG_nt9_QYQUcg" type="Ird" element="_33D0EIoaEeG_nt9_QYQUcg" name="default.workflow" measurementUnit="Pixel">
    <children xmi:type="notation:Shape" xmi:id="_6fiIENz6EeKyG9aF7VXEXg" type="1001" element="_6e2LkNz6EeKyG9aF7VXEXg">
      <children xmi:type="notation:DecorationNode" xmi:id="_6fj9QNz6EeKyG9aF7VXEXg" type="6003"/>
      <children xmi:type="notation:DecorationNode" xmi:id="_6fj9Qdz6EeKyG9aF7VXEXg" type="6001"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="_6fiIEdz6EeKyG9aF7VXEXg" x="170" y="68"/>
    </children>
    <children xmi:type="notation:Shape" xmi:id="_6nkCsNz6EeKyG9aF7VXEXg" type="1002" element="_6niNgNz6EeKyG9aF7VXEXg">
      <children xmi:type="notation:DecorationNode" xmi:id="_6nkCstz6EeKyG9aF7VXEXg" type="6002"/>
      <children xmi:type="notation:DecorationNode" xmi:id="_6nkCs9z6EeKyG9aF7VXEXg" type="4001"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="_6nkCsdz6EeKyG9aF7VXEXg" x="374" y="340"/>
    </children>
    <children xmi:type="notation:Shape" xmi:id="_Iq7hUIwcEem8d8WkRWaMOg" type="1006" element="_IqutAIwcEem8d8WkRWaMOg" fontName="Segoe UI">
      <children xmi:type="notation:DecorationNode" xmi:id="_Iq8IYYwcEem8d8WkRWaMOg" type="4008"/>
      <children xmi:type="notation:DecorationNode" xmi:id="_Iq8IYowcEem8d8WkRWaMOg" type="4009"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="_Iq8IYIwcEem8d8WkRWaMOg" x="423" y="150"/>
    </children>
    <children xmi:type="notation:Shape" xmi:id="_JOT7MIwcEem8d8WkRWaMOg" type="1007" element="_JOTUIIwcEem8d8WkRWaMOg" fontName="Segoe UI">
      <children xmi:type="notation:DecorationNode" xmi:id="_JOUiQIwcEem8d8WkRWaMOg" type="4010"/>
      <children xmi:type="notation:DecorationNode" xmi:id="_JOUiQYwcEem8d8WkRWaMOg" type="4011"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="_JOT7MYwcEem8d8WkRWaMOg" x="286" y="162"/>
    </children>
    <children xmi:type="notation:Shape" xmi:id="_53lE8IwfEem8d8WkRWaMOg" type="1041" element="_53j20IwfEem8d8WkRWaMOg" fontName="Segoe UI">
      <children xmi:type="notation:DecorationNode" xmi:id="_53lsAIwfEem8d8WkRWaMOg" type="4079"/>
      <children xmi:type="notation:DecorationNode" xmi:id="_53lsAYwfEem8d8WkRWaMOg" type="4080"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="_53lE8YwfEem8d8WkRWaMOg" x="696" y="186"/>
    </children>
    <children xmi:type="notation:Shape" xmi:id="_gfgXgIwhEem8d8WkRWaMOg" type="1003" element="_gfiMsIwhEem8d8WkRWaMOg" fontName="Microsoft Sans Serif">
      <children xmi:type="notation:DecorationNode" xmi:id="_gfgXgYwhEem8d8WkRWaMOg" type="4002"/>
      <children xmi:type="notation:DecorationNode" xmi:id="_gfgXgowhEem8d8WkRWaMOg" type="4003"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="_gfgXg4whEem8d8WkRWaMOg" x="544" y="34"/>
    </children>
    <children xmi:type="notation:Shape" xmi:id="_I4P5wI3LEem45N-Ef20MRA" type="1004" element="_I4GIwI3LEem45N-Ef20MRA" fontName="Segoe UI">
      <children xmi:type="notation:DecorationNode" xmi:id="_I4P5wo3LEem45N-Ef20MRA" type="4004"/>
      <children xmi:type="notation:DecorationNode" xmi:id="_I4P5w43LEem45N-Ef20MRA" type="4005"/>
      <layoutConstraint xmi:type="notation:Bounds" xmi:id="_I4P5wY3LEem45N-Ef20MRA" x="539" y="381"/>
    </children>
    <styles xmi:type="notation:DiagramStyle" xmi:id="_33D0EooaEeG_nt9_QYQUcg"/>
    <edges xmi:type="notation:Connector" xmi:id="_7uywgNz6EeKyG9aF7VXEXg" type="3001" element="_7uvtMNz6EeKyG9aF7VXEXg" source="_6fiIENz6EeKyG9aF7VXEXg" target="_JOT7MIwcEem8d8WkRWaMOg" roundedBendpointsRadius="10" routing="Rectilinear" closestDistance="true" lineColor="16711680">
      <children xmi:type="notation:DecorationNode" xmi:id="_7uzXkNz6EeKyG9aF7VXEXg" type="5001">
        <layoutConstraint xmi:type="notation:Location" xmi:id="_7uzXkdz6EeKyG9aF7VXEXg" x="5" y="5"/>
      </children>
      <styles xmi:type="notation:FontStyle" xmi:id="_7uywgdz6EeKyG9aF7VXEXg"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="_7uywgtz6EeKyG9aF7VXEXg" points="[4, 0, 0, -100]$[4, 100, 0, 0]"/>
      <sourceAnchor xmi:type="notation:IdentityAnchor" xmi:id="_7vKj8Nz6EeKyG9aF7VXEXg" id="(0.4818181818181818,1.0)"/>
    </edges>
    <edges xmi:type="notation:Connector" xmi:id="_Lkkn8IwcEem8d8WkRWaMOg" type="3001" element="_LkjZ0IwcEem8d8WkRWaMOg" source="_JOT7MIwcEem8d8WkRWaMOg" target="_gfgXgIwhEem8d8WkRWaMOg" roundedBendpointsRadius="10" routing="Rectilinear" closestDistance="true" lineColor="16711680">
      <children xmi:type="notation:DecorationNode" xmi:id="_LklPAIwcEem8d8WkRWaMOg" type="5001">
        <layoutConstraint xmi:type="notation:Location" xmi:id="_LklPAYwcEem8d8WkRWaMOg" x="5" y="5"/>
      </children>
      <styles xmi:type="notation:FontStyle" xmi:id="_Lkkn8YwcEem8d8WkRWaMOg" fontName="Segoe UI"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="_Lkkn8owcEem8d8WkRWaMOg" points="[55, -25, -78, 34]$[132, -62, -1, -3]"/>
      <sourceAnchor xmi:type="notation:IdentityAnchor" xmi:id="_LknrQIwcEem8d8WkRWaMOg" id="(0.5,1.0)"/>
    </edges>
    <edges xmi:type="notation:Connector" xmi:id="_OnZfwIwcEem8d8WkRWaMOg" type="3001" element="_OnY4sIwcEem8d8WkRWaMOg" source="_Iq7hUIwcEem8d8WkRWaMOg" target="_53lE8IwfEem8d8WkRWaMOg" roundedBendpointsRadius="10" routing="Rectilinear" closestDistance="true" lineColor="16711680">
      <children xmi:type="notation:DecorationNode" xmi:id="_OnaG0IwcEem8d8WkRWaMOg" type="5001">
        <layoutConstraint xmi:type="notation:Location" xmi:id="_OnaG0YwcEem8d8WkRWaMOg" x="5" y="5"/>
      </children>
      <styles xmi:type="notation:FontStyle" xmi:id="_OnZfwYwcEem8d8WkRWaMOg" fontName="Segoe UI"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="_OnZfwowcEem8d8WkRWaMOg" points="[0, 0, 21, -58]$[-22, 50, -1, -8]"/>
      <sourceAnchor xmi:type="notation:IdentityAnchor" xmi:id="_OncjEIwcEem8d8WkRWaMOg" id="(0.4636363636363636,1.0)"/>
    </edges>
    <edges xmi:type="notation:Connector" xmi:id="_7P0DMIwfEem8d8WkRWaMOg" type="3001" element="_7PzcIIwfEem8d8WkRWaMOg" source="_53lE8IwfEem8d8WkRWaMOg" target="_I4P5wI3LEem45N-Ef20MRA" roundedBendpointsRadius="10" routing="Rectilinear" closestDistance="true" lineColor="16711680">
      <children xmi:type="notation:DecorationNode" xmi:id="_7P0DM4wfEem8d8WkRWaMOg" type="5001">
        <layoutConstraint xmi:type="notation:Location" xmi:id="_7P0DNIwfEem8d8WkRWaMOg" x="5" y="5"/>
      </children>
      <styles xmi:type="notation:FontStyle" xmi:id="_7P0DMYwfEem8d8WkRWaMOg" fontName="Segoe UI"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="_7P0DMowfEem8d8WkRWaMOg" points="[0, 0, 295, -18]$[-295, 14, 0, -4]"/>
      <sourceAnchor xmi:type="notation:IdentityAnchor" xmi:id="_7P14YIwfEem8d8WkRWaMOg" id="(0.4909090909090909,1.0)"/>
    </edges>
    <edges xmi:type="notation:Connector" xmi:id="_j7v04IwhEem8d8WkRWaMOg" type="3001" element="_j7umwIwhEem8d8WkRWaMOg" source="_gfgXgIwhEem8d8WkRWaMOg" target="_Iq7hUIwcEem8d8WkRWaMOg" roundedBendpointsRadius="10" routing="Rectilinear" closestDistance="true" lineColor="16711680">
      <children xmi:type="notation:DecorationNode" xmi:id="_j7v044whEem8d8WkRWaMOg" type="5001">
        <layoutConstraint xmi:type="notation:Location" xmi:id="_j7v05IwhEem8d8WkRWaMOg" x="5" y="5"/>
      </children>
      <styles xmi:type="notation:FontStyle" xmi:id="_j7v04YwhEem8d8WkRWaMOg" fontName="Segoe UI"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="_j7v04owhEem8d8WkRWaMOg" points="[0, 0, 49, -38]$[-48, 32, 1, -6]"/>
      <sourceAnchor xmi:type="notation:IdentityAnchor" xmi:id="_j7yRIIwhEem8d8WkRWaMOg" id="(0.5,1.0)"/>
      <targetAnchor xmi:type="notation:IdentityAnchor" xmi:id="_j7yRIYwhEem8d8WkRWaMOg" id="(0.5363636363636364,0.12)"/>
    </edges>
    <edges xmi:type="notation:Connector" xmi:id="_JdCMYY3MEem45N-Ef20MRA" type="3001" element="_JdCMYI3MEem45N-Ef20MRA" source="_I4P5wI3LEem45N-Ef20MRA" target="_6nkCsNz6EeKyG9aF7VXEXg" roundedBendpointsRadius="10" routing="Rectilinear" closestDistance="true" lineColor="16711680">
      <children xmi:type="notation:DecorationNode" xmi:id="_JdCMZI3MEem45N-Ef20MRA" type="5001">
        <layoutConstraint xmi:type="notation:Location" xmi:id="_JdCMZY3MEem45N-Ef20MRA" x="5" y="5"/>
      </children>
      <styles xmi:type="notation:FontStyle" xmi:id="_JdCMYo3MEem45N-Ef20MRA" fontName="Segoe UI"/>
      <bendpoints xmi:type="notation:RelativeBendpoints" xmi:id="_JdCMY43MEem45N-Ef20MRA" points="[-52, -28, 115, 60]$[-168, -91, -1, -3]"/>
      <sourceAnchor xmi:type="notation:IdentityAnchor" xmi:id="_JdCMZo3MEem45N-Ef20MRA" id="(0.4727272727272727,1.0)"/>
      <targetAnchor xmi:type="notation:IdentityAnchor" xmi:id="_JdCMZ43MEem45N-Ef20MRA" id="(0.45454545454545453,0.06)"/>
    </edges>
  </notation:Diagram>
</xmi:XMI>
