\xef\xbb\xbf# Petit serveur local (aucune installation nécessaire) pour tester le site
$port = 8080
$racine = $PSScriptRoot
$types = @{
    ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"; ".js" = "application/javascript; charset=utf-8"
    ".csv" = "text/csv; charset=utf-8"; ".json" = "application/json"; ".png" = "image/png"; ".jpg" = "image/jpeg"
    ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"; ".md" = "text/plain; charset=utf-8"
}

$serveur = New-Object System.Net.HttpListener
$serveur.Prefixes.Add("http://localhost:$port/")
try { $serveur.Start() }
catch { Write-Host "Impossible de démarrer sur le port $port (déjà utilisé ?). Fermez l'autre fenêtre du serveur puis réessayez." -ForegroundColor Red; exit 1 }

$adresse = "http://localhost:$port/index3.html"
Write-Host ""
Write-Host "  AUTO RENT - le site est disponible ici :" -ForegroundColor Green
Write-Host "  $adresse"
Write-Host ""
Write-Host "  Pour arreter : fermez cette fenetre (ou Ctrl+C)."
Start-Process $adresse

while ($serveur.IsListening) {
    $contexte = $serveur.GetContext()
    $chemin = [Uri]::UnescapeDataString($contexte.Request.Url.AbsolutePath.TrimStart("/"))
    if ($chemin -eq "") { $chemin = "index3.html" }
    $fichier = Join-Path $racine $chemin

    if ((Test-Path $fichier -PathType Leaf) -and ((Resolve-Path $fichier).Path.StartsWith($racine, [StringComparison]::OrdinalIgnoreCase))) {
        $octets = [IO.File]::ReadAllBytes($fichier)
        $ext = [IO.Path]::GetExtension($fichier).ToLower()
        $contexte.Response.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
        $contexte.Response.Headers.Add("Cache-Control", "no-cache")
        $contexte.Response.OutputStream.Write($octets, 0, $octets.Length)
    } else {
        $contexte.Response.StatusCode = 404
    }
    $contexte.Response.Close()
}
